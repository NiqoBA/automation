const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

// --- CONFIGURACIÓN ---
// Reemplaza esto con tu URL de Webhook de n8n
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK || 'https://n8n.srv908725.hstgr.cloud/webhook/scraper';
// ---------------------

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
            const url = currentPage === 1 ? baseUrl : `${baseUrl}/pagina/${currentPage}`;
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
                    const link = `https://www.infocasas.com.uy${item.link}`;
                    // Evitar duplicados internos por ID o Link
                    if (!allListings.some(x => x.id === item.id || x.link === link)) {
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
                            link: link
                        });
                        newItemsFound++;
                    }
                });

                // Si no hay ítems nuevos en esta página, detenemos la paginación
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
            const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

            if (response.url() !== url && currentPage > 1) break;

            const content = await page.content();
            const $ = cheerio.load(content);
            const pageResults = [];
            const cards = $('.prop-entrada');

            if (cards.length === 0) break;

            let newItemsFound = 0;
            cards.each((i, el) => {
                const card = $(el);
                const link = 'https://www.casasymas.com.uy' + card.attr('href');
                const id = card.attr('data-id') || (currentPage * 1000 + i);

                if (allListings.some(x => x.link === link || x.id === id)) return;

                const title = card.find('.titulo-prop').text().trim();
                const priceText = card.find('.precio').text().trim();
                const priceVal = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;
                const currency = priceText.includes('$') && !priceText.includes('U') ? '$' : 'U$S';
                const neighborhood = card.find('.localidad_p').text().trim().split(' ')[0] || '';

                let rooms = 0;
                let m2 = 0;
                card.find('ul li').each((j, li) => {
                    const text = $(li).text().trim();
                    const img = $(li).find('img').attr('title');
                    if (img === 'Dormitorios') rooms = parseInt(text) || 0;
                    if (img && img.includes('Superficie')) m2 = parseInt(text) || 0;
                });

                let phone = 'Consultar';
                const whatsappBtn = card.find('.action-link.whatsapp').attr('onclick');
                if (whatsappBtn) {
                    const match = whatsappBtn.match(/wa\.me\/([0-9]+)/);
                    if (match) phone = '+' + match[1];
                }

                allListings.push({
                    portal: 'CasasYMas',
                    id,
                    title,
                    price: priceVal,
                    currency,
                    neighborhood,
                    m2,
                    rooms,
                    agency: 'Inmobiliaria / Particular',
                    phone,
                    link
                });
                newItemsFound++;
            });

            if (newItemsFound === 0) {
                hasNextPage = false;
            } else {
                const nextButton = $('.pagination .page-item a[aria-label="Next"]');
                if (nextButton.length === 0 || currentPage >= 15) {
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

            // Criterios de duplicidad: mismo barrio, mismo precio y (mismos cuartos o m2 similares)
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
            item2.isDuplicate = true;
            item1.duplicateRef = item2.link;
            item2.duplicateRef = item1.link;

            // Preferir el portal que tenga teléfono real si uno dice 'Consultar'
            if (item1.phone === 'Consultar' && item2.phone !== 'Consultar') {
                item1.phone = item2.phone;
            }

            duplicates.push({ a: item1, b: item2 });
            // No lo agregamos a combined para evitar que el usuario reciba la misma propiedad dos veces
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
            timestamp: new Date().toISOString(),
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
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });

    try {
        const [infoCasasResults, casasYMasResults] = await Promise.all([
            scrapeInfoCasas(browser),
            scrapeCasasYMas(browser)
        ]);

        const { combined, duplicates } = detectDuplicates(infoCasasResults, casasYMasResults);

        // Reporte de Texto Local
        let output = '';
        output += `REPORTE UNIFICADO - ${new Date().toLocaleDateString()}\n`;
        output += `Total: ${combined.length} (Duplicados: ${duplicates.length})\n\n`;
        combined.forEach((item, index) => {
            const dupInfo = item.isDuplicate ? ' [⚠️ DUPLICADO]' : '';
            output += `#${index + 1}${dupInfo} - ${item.portal}\n`;
            output += `${item.title}\n`;
            output += `${item.currency} ${item.price} | ${item.neighborhood} | ${item.m2}m²\n`;
            output += `Inmobiliaria: ${item.agency}\n`;
            output += `Tel: ${item.phone}\n`;
            output += `Link: ${item.link}\n`;
            if (item.duplicateRef) output += `Ref: ${item.duplicateRef}\n`;
            output += '--------------------------------------------------\n';
        });
        fs.writeFileSync('reporte_final.txt', output);
        console.log('Archivo local guardado: reporte_final.txt');

        // Enviar a N8N
        await sendToN8N(combined, {
            total: combined.length,
            duplicates: duplicates.length,
            source_infocasas: infoCasasResults.length,
            source_casasymas: casasYMasResults.length
        });

    } catch (error) {
        console.error('Error general:', error);
    } finally {
        await browser.close();
    }
})();
