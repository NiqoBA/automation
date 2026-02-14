const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

// --- CONFIGURACIÓN ---
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK || 'https://n8n.srv908725.hstgr.cloud/webhook/scraper';
const MIN_PRICE_FOR_DETAIL = 100000;
// ---------------------

function getUruguayTime() {
    const now = new Date();
    // Formato YYYY-MM-DDTHH:mm:ss ajustado a Uruguay (GMT-3)
    return new Intl.DateTimeFormat('sv-SE', {
        timeZone: 'America/Montevideo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(now).replace(' ', 'T');
}

async function scrapeInfoCasas(browser) {
    console.log('[InfoCasas] Iniciando scraper...');
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    const baseUrl = 'https://www.infocasas.com.uy/venta/inmuebles/montevideo/publicado-hoy';
    let allListings = [];
    let currentPage = 1;
    let hasNextPage = true;

    try {
        while (hasNextPage) {
            const url = currentPage === 1 ? baseUrl : `${baseUrl}/pagina${currentPage}`;
            console.log(`[InfoCasas] Navegando a página ${currentPage}...`);

            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

            const content = await page.content();
            const $ = cheerio.load(content);
            const nextDataScript = $('#__NEXT_DATA__').html();

            if (!nextDataScript) {
                console.log('[InfoCasas] Fin de paginación o error.');
                break;
            }

            const jsonData = JSON.parse(nextDataScript);

            function findListings(obj, depth = 0) {
                if (depth > 8 || !obj || typeof obj !== 'object') return null;
                if (Array.isArray(obj) && obj.length > 0 && obj[0].id && obj[0].title && obj[0].price) return obj;
                for (const key of Object.keys(obj)) {
                    if (['places', 'footer', 'menu', 'filters'].includes(key)) continue;
                    const result = findListings(obj[key], depth + 1);
                    if (result) return result;
                }
                return null;
            }

            const pageListings = findListings(jsonData.props.pageProps) || [];

            if (pageListings.length === 0) {
                hasNextPage = false;
            } else {
                let newItemsFound = 0;
                pageListings.forEach(item => {
                    // No price filter for InfoCasas — data comes from JSON, no extra fetch cost
                    const link = `https://www.infocasas.com.uy${item.link}`;
                    if (!allListings.some(x => x.id === item.id || x.link === link)) {
                        // Construir URL de imagen si existe
                        let imgUrl = null;
                        const photoSource = item.img || (item.images && item.images.length > 0 ? item.images[0].image : null) || item.photo;

                        if (photoSource) {
                            imgUrl = photoSource.startsWith('http')
                                ? photoSource
                                : `https://images.infocasas.com.uy/${photoSource.startsWith('/') ? photoSource.substring(1) : photoSource}`;
                        }

                        allListings.push({
                            portal: 'InfoCasas',
                            id: item.id,
                            title: item.title,
                            price: item.price?.amount || 0,
                            currency: item.price?.currency?.name || 'U$S',
                            neighborhood: item.locations?.neighbourhood?.[0]?.name || '',
                            m2: item.m2 || item.m2Built || 0,
                            rooms: item.bedrooms || 0,
                            agency: item.owner?.name || 'Particular',
                            phone: item.owner?.whatsapp_phone || item.owner?.masked_phone || 'Consultar',
                            link: link,
                            img_url: imgUrl
                        });
                        newItemsFound++;
                    }
                });

                if (newItemsFound === 0) {
                    hasNextPage = false;
                } else {
                    currentPage++;
                    if (currentPage > 15) hasNextPage = false;
                }
            }
        }
    } catch (e) {
        console.error('[InfoCasas] Error:', e.message);
    } finally {
        await page.close();
    }
    return allListings;
}

async function getCasasYMasDetail(browser, url) {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        const content = await page.content();
        const $ = cheerio.load(content);
        const ldJsonText = $('script[type="application/ld+json"]').html();
        if (ldJsonText) {
            try {
                const data = JSON.parse(ldJsonText);
                const listing = Array.isArray(data) ? data.find(i => i['@type'] === 'RealEstateListing') : (data['@type'] === 'RealEstateListing' ? data : null);
                if (listing) {
                    return {
                        price: listing.offers?.price || 0,
                        currency: listing.offers?.priceCurrency === 'USD' ? 'U$S' : (listing.offers?.priceCurrency || 'U$S'),
                        agency: listing.offers?.seller?.name || 'Particular',
                        phone: listing.offers?.seller?.telephone || 'Consultar',
                        description: listing.description || '',
                        m2: listing.mainEntity?.floorSize?.value || 0,
                        rooms: listing.mainEntity?.numberOfBedrooms || 0,
                        neighborhood: listing.mainEntity?.address?.addressLocality || '',
                        image: $('meta[property="og:image"]').attr('content') || listing.image
                    };
                }
            } catch (e) {
                console.error(`[Casasymas] Error parsing JSON-LD for ${url}`);
            }
        }
    } catch (e) {
        console.error(`[Casasymas] Error loading detail for ${url}: ${e.message}`);
    } finally {
        await page.close();
    }
    return null;
}

async function scrapeCasasYMas(browser) {
    console.log('[Casasymas] Iniciando scraper...');
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    let allListings = [];
    let currentPage = 1;
    let hasNextPage = true;

    try {
        while (hasNextPage) {
            const url = currentPage === 1
                ? 'https://www.casasymas.com.uy/propiedades/venta/publicadas=hoy'
                : `https://www.casasymas.com.uy/propiedades/venta/publicadas=hoy/pagina-${currentPage}`;

            console.log(`[Casasymas] Navegando a página ${currentPage}...`);
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

            const content = await page.content();
            const $ = cheerio.load(content);
            const cards = $('.prop-entrada');

            if (cards.length === 0) break;

            let newItemsFound = 0;
            const pendingDetails = [];

            for (let i = 0; i < cards.length; i++) {
                const card = $(cards[i]);
                const link = 'https://www.casasymas.com.uy' + card.attr('href');
                const id = card.attr('data-id') || (currentPage * 1000 + i);

                const priceText = card.find('.precio').text().trim();
                const priceVal = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;

                if (priceVal < MIN_PRICE_FOR_DETAIL) continue;
                if (allListings.some(x => x.link === link || x.id === id)) continue;

                pendingDetails.push({ id, link, initialPrice: priceVal });
                newItemsFound++;
            }

            console.log(`[Casasymas] Obteniendo detalles para ${pendingDetails.length} propiedades...`);
            // Procesamos detalles de 3 en 3 para no saturar
            for (let i = 0; i < pendingDetails.length; i += 3) {
                const chunk = pendingDetails.slice(i, i + 3);
                const results = await Promise.all(chunk.map(item => getCasasYMasDetail(browser, item.link)));

                results.forEach((detail, idx) => {
                    const original = chunk[idx];
                    if (detail) {
                        allListings.push({
                            portal: 'CasasYMas',
                            id: original.id,
                            title: detail.description ? detail.description.substring(0, 100) + '...' : 'Propiedad en CasasYMas',
                            price: detail.price || original.initialPrice,
                            currency: detail.currency,
                            neighborhood: detail.neighborhood,
                            m2: detail.m2,
                            rooms: detail.rooms,
                            agency: detail.agency,
                            phone: detail.phone,
                            link: original.link,
                            img_url: detail.image
                        });
                    }
                });
                await new Promise(r => setTimeout(r, 1000)); // Anti-ban delay
            }

            if (newItemsFound === 0) {
                hasNextPage = false;
            } else {
                const nextButton = $('.pagination .page-item a[aria-label="Next"]');
                if (nextButton.length === 0 || currentPage >= 10) { // Reducido para evitar tiempos excesivos
                    hasNextPage = false;
                } else {
                    currentPage++;
                }
            }
        }
    } catch (e) {
        console.error('[Casasymas] Error:', e.message);
    } finally {
        await page.close();
    }
    return allListings;
}

function normalizeString(str) {
    if (!str) return '';
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '');
}

function detectDuplicates(list1, list2) {
    const combined = [...list1];
    const duplicates = [];

    for (const item2 of list2) {
        let foundDuplicateIdx = -1;
        const normNeighborhood2 = normalizeString(item2.neighborhood);

        for (let i = 0; i < combined.length; i++) {
            const item1 = combined[i];
            const normNeighborhood1 = normalizeString(item1.neighborhood);

            const sameNeighborhood = (normNeighborhood1 === normNeighborhood2 && normNeighborhood1 !== '');
            const samePrice = (item1.price === item2.price && item1.price > 0);
            const similarM2 = Math.abs(item1.m2 - item2.m2) <= 3 && item1.m2 > 0;
            const sameRooms = item1.rooms === item2.rooms && item1.rooms > 0;

            if (sameNeighborhood && samePrice && (sameRooms || similarM2)) {
                foundDuplicateIdx = i;
                break;
            }
        }

        if (foundDuplicateIdx !== -1) {
            const item1 = combined[foundDuplicateIdx];
            item1.isDuplicate = true;

            // Conservar imagen si el primero no tenía
            if (!item1.img_url && item2.img_url) {
                item1.img_url = item2.img_url;
            }

            // Solo combinamos si son portales distintos y aún no ha sido combinado
            if (item1.portal !== item2.portal && !item1.portal.includes(' + ')) {
                // Identificamos cual es cual antes de sobreescribir el portal
                const infoLink = item1.portal === "InfoCasas" ? item1.link : item2.link;
                const casasLink = item1.portal === "CasasYMas" ? item1.link : item2.link;

                item1.portal = "InfoCasas + CasasYMas";
                item1.link = `${infoLink} + ${casasLink}`;
            }

            // Preferir el portal que tenga teléfono real si uno dice 'Consultar'
            if (item1.phone === 'Consultar' && item2.phone !== 'Consultar') {
                item1.phone = item2.phone;
            }

            duplicates.push({ a: item1, b: item2 });
        } else {
            combined.push(item2);
        }
    }
    return { combined, duplicates };
}

async function sendToN8N(data, summary) {
    if (!N8N_WEBHOOK_URL || N8N_WEBHOOK_URL.includes('AQUI')) {
        console.log('[Webhook] URL no configurada. Omitiendo envío.');
        return;
    }
    console.log('[Webhook] Enviando datos a n8n...');
    try {
        const payload = {
            timestamp: getUruguayTime(),
            date: getUruguayTime().split('T')[0],
            start_time: summary.start_time,
            end_time: summary.end_time,
            count: data.length,
            project_id: process.env.PROJECT_ID || null, // Importante para asociar a la DB
            summary: summary,
            properties: data
        };
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (response.ok) {
            console.log('[Webhook] Datos enviados exitosamente!');
        } else {
            console.error(`[Webhook] Error al enviar: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error('[Webhook] Error de red:', error.message);
    }
}

(async () => {
    const startTime = getUruguayTime();
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });

    try {
        const [infoCasasResults, casasYMasResults] = await Promise.all([
            scrapeInfoCasas(browser),
            scrapeCasasYMas(browser)
        ]);

        const { combined, duplicates } = detectDuplicates(infoCasasResults, casasYMasResults);

        // Filtrar opcionalmente solo >= 100k (aunque ya se filtró en scrapers)
        const finalResults = combined.filter(item => item.price >= MIN_PRICE_FOR_DETAIL);

        let output = `REPORTE UNIFICADO EXTRA (>= 100k) - ${new Date().toLocaleString()}\n`;
        output += `Total final: ${finalResults.length} (Duplicados entre portales: ${duplicates.length})\n\n`;
        finalResults.forEach((item, index) => {
            output += `#${index + 1} - ${item.portal}\n`;
            output += `Precio: ${item.currency} ${item.price} | Barrio: ${item.neighborhood} | M2: ${item.m2}\n`;
            output += `Inmobiliaria: ${item.agency} | Tel: ${item.phone}\n`;
            output += `Link: ${item.link}\n`;
            output += `Imagen: ${item.img_url || 'N/A'}\n`;
            output += '--------------------------------------------------\n';
        });

        fs.writeFileSync('Salida2.0.txt', output);
        fs.writeFileSync('reporte_final.txt', output);
        console.log('Archivos guardados: Salida2.0.txt y reporte_final.txt');

        await sendToN8N(finalResults, {
            total: finalResults.length,
            duplicates: duplicates.length,
            source_infocasas: infoCasasResults.length,
            source_casasymas: casasYMasResults.length,
            start_time: startTime,
            end_time: getUruguayTime()
        });

    } catch (error) {
        console.error('Error general:', error);
    } finally {
        await browser.close();
    }
})();

