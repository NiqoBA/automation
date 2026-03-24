const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

// --- CONFIGURACIÓN ---
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK || 'https://n8n.srv908725.hstgr.cloud/webhook/scraper';
const MIN_PRICE_FOR_DETAIL = 100000;
const TEST_OUTPUT_JSON = process.env.TEST_OUTPUT_JSON || '';
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

function parseVeoPrice(raw) {
    if (!raw) return 0;
    const n = raw.replace(/[^0-9]/g, '');
    return parseInt(n, 10) || 0;
}

/**
 * Nombre de inmobiliaria en la ficha (bloque "Información de la inmobiliaria" en veocasas.com).
 * No usar innerText colapsado a una sola línea: el título y el nombre suelen ir en líneas distintas.
 */
function extractVeoCasasAgencyName(rawBody) {
    if (!rawBody) return '';
    const body = String(rawBody).replace(/\r\n/g, '\n');
    const m = body.match(/información\s+de\s+la\s+inmobiliaria/i);
    if (!m || m.index === undefined) return '';
    let rest = body.slice(m.index + m[0].length).trim();
    // Cortar antes de los botones (a veces pegados: "Ver teléfonoVer perfil")
    const stopAt = (needle) => {
        const p = rest.indexOf(needle);
        return p === -1 ? rest.length : p;
    };
    const cut = Math.min(
        stopAt('Ver teléfono'),
        stopAt('Ver perfil'),
        stopAt('Propiedades similares'),
        stopAt('Consultar por préstamo')
    );
    rest = rest.slice(0, cut).trim();
    const lines = rest.split(/\n/).map((l) => l.trim()).filter(Boolean);
    const name = lines[0] || '';
    if (name.length < 2 || name.length > 120) return '';
    if (/^(ver\s|detalles|montevideo|us\$|super\s)/i.test(name)) return '';
    return name;
}

async function getVeoCasasDetail(browser, url) {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        const data = await page.evaluate(() => {
            // innerText preserva saltos de línea útiles para el bloque de inmobiliaria
            const bodyRaw = document.body?.innerText || '';
            const title = (document.querySelector('h1')?.textContent || '').trim();
            const img = document.querySelector('meta[property="og:image"]')?.getAttribute('content') || null;
            const wa = document.querySelector('a[href*="wa.me/"]')?.getAttribute('href') || '';
            // Fallback DOM: encabezado visible junto al logo del anunciante
            let agencyFromDom = '';
            const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();
            const headings = Array.from(document.querySelectorAll('h2, h3, h4, p, span, div'));
            const h = headings.find(
                (el) => /^información de la inmobiliaria$/i.test(norm(el.textContent))
            );
            if (h) {
                const root = h.closest('section') || h.parentElement?.parentElement || h.parentElement;
                if (root) {
                    const profileLinks = root.querySelectorAll(
                        'a[href*="/profile"], a[href*="/agency"], a[href*="/inmobiliaria"], a[href*="/broker"], a[href*="/company"]'
                    );
                    for (const a of profileLinks) {
                        const t = norm(a.textContent);
                        if (t && t.length < 120 && !/^ver\s/i.test(t)) {
                            agencyFromDom = t;
                            break;
                        }
                    }
                }
            }
            return { bodyRaw, title, img, wa, agencyFromDom };
        });

        const bodyFlat = (data.bodyRaw || '').replace(/\s+/g, ' ').trim();
        // Typical line:
        // "Detalles Parque Batlle Montevideo US$ 199.000 2 1 111m2"
        const locationMatch = bodyFlat.match(
            /Detalles\s+(.+?)\s+(Montevideo|Canelones|Maldonado|Rocha|Colonia|San José|Paysandú|Salto|Florida|Lavalleja|Soriano|Durazno|Treinta y Tres|Rivera|Tacuarembó|Artigas)\s+U(?:S)?\$\s*([\d\.\,]+)/i
        );
        const metricMatch = bodyFlat.match(/U(?:S)?\$\s*[\d\.\,]+\s+(\d+)\s+(\d+)\s+(\d+)\s*m2/i);
        const phoneMatch = data.wa.match(/wa\.me\/(\d+)/i);

        const neighborhood = locationMatch?.[1]?.trim() || '';
        const department = locationMatch?.[2]?.trim() || '';
        const price = parseVeoPrice(locationMatch?.[3] || (bodyFlat.match(/U(?:S)?\$\s*([\d\.\,]+)/i)?.[1] || ''));
        const rooms = metricMatch ? parseInt(metricMatch[1], 10) || 0 : 0;
        const m2 = metricMatch ? parseInt(metricMatch[3], 10) || 0 : 0;
        const phone = phoneMatch?.[1] || 'Consultar';

        const agency =
            (data.agencyFromDom && data.agencyFromDom.trim()) ||
            extractVeoCasasAgencyName(data.bodyRaw) ||
            '';

        return {
            title: data.title || 'Propiedad en VeoCasas',
            price,
            currency: 'U$S',
            neighborhood,
            department,
            rooms,
            m2,
            phone,
            agency,
            image: data.img
        };
    } catch (e) {
        console.error(`[VeoCasas] Error loading detail for ${url}: ${e.message}`);
    } finally {
        await page.close();
    }
    return null;
}

async function scrapeVeoCasas(browser) {
    console.log('[VeoCasas] Iniciando scraper...');
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // Listado: Montevideo (location=1), USD ≥100k, publicadas hoy (publicationDate=1); páginas 1–5 vía &page=N
    const baseUrl = 'https://veocasas.com/properties?location=1&recenter=1&currency=USD&minPrice=100000&publicationDate=1';
    const maxPages = Math.min(5, Math.max(1, parseInt(process.env.VEO_MAX_PAGES || '5', 10) || 5));
    let allListings = [];
    const seenLinks = new Set();

    try {
        for (let currentPage = 1; currentPage <= maxPages; currentPage++) {
            const url = `${baseUrl}&page=${currentPage}`;
            console.log(`[VeoCasas] Navegando a página ${currentPage}...`);
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

            const links = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('a[href^="/properties/"]'))
                    .map(a => a.getAttribute('href'))
                    .filter(href => href && !href.includes('#contact-form'))
                    .filter((href, idx, arr) => arr.indexOf(href) === idx)
                    .map(href => `https://veocasas.com${href}`);
            });

            if (!links || links.length === 0) {
                console.log('[VeoCasas] Fin de paginación o sin resultados.');
                break;
            }

            let newLinks = links.filter(link => !seenLinks.has(link));
            const maxLinks = parseInt(process.env.VEO_MAX_LINKS || '0', 10);
            if (maxLinks > 0) newLinks = newLinks.slice(0, maxLinks);
            newLinks.forEach(link => seenLinks.add(link));

            if (newLinks.length === 0) {
                console.log('[VeoCasas] Sin links nuevos, finalizando.');
                break;
            }

            console.log(`[VeoCasas] Obteniendo detalles de ${newLinks.length} propiedades...`);
            for (let i = 0; i < newLinks.length; i += 3) {
                const chunk = newLinks.slice(i, i + 3);
                const results = await Promise.all(chunk.map(link => getVeoCasasDetail(browser, link)));

                results.forEach((detail, idx) => {
                    const link = chunk[idx];
                    if (!detail) return;
                    // Maintain same business rules as current scraper project
                    if ((detail.department || '').toLowerCase() !== 'montevideo') return;
                    if (detail.price < MIN_PRICE_FOR_DETAIL) return;

                    allListings.push({
                        portal: 'VeoCasas',
                        id: link.split('/properties/')[1] || link,
                        title: detail.title,
                        price: detail.price,
                        currency: detail.currency,
                        neighborhood: detail.neighborhood,
                        m2: detail.m2,
                        rooms: detail.rooms,
                        agency: (detail.agency && String(detail.agency).trim()) || 'Particular',
                        phone: detail.phone,
                        link,
                        img_url: detail.image
                    });
                });

                await new Promise(r => setTimeout(r, 800));
            }
        }
    } catch (e) {
        console.error('[VeoCasas] Error:', e.message);
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
    const payload = {
        timestamp: getUruguayTime(),
        date: getUruguayTime().split('T')[0],
        start_time: summary.start_time,
        end_time: summary.end_time,
        count: data.length,
        project_id: process.env.PROJECT_ID || null,
        summary: summary,
        errors: summary.errors || [],
        properties: data
    };

    if (TEST_OUTPUT_JSON) {
        try {
            fs.writeFileSync(TEST_OUTPUT_JSON, JSON.stringify(payload, null, 2), 'utf8');
            console.log(`[JSON] Resultado guardado en ${TEST_OUTPUT_JSON}`);
        } catch (e) {
            console.error(`[JSON] Error al guardar ${TEST_OUTPUT_JSON}:`, e.message);
        }
    }

    if (!N8N_WEBHOOK_URL || N8N_WEBHOOK_URL.includes('AQUI')) {
        console.log('[Webhook] URL no configurada. Omitiendo envío.');
        return { ok: false, error: 'URL no configurada' };
    }
    console.log('[Webhook] Enviando datos a n8n...');
    try {
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(30000)
        });
        if (response.ok) {
            console.log('[Webhook] Datos enviados exitosamente!');
            return { ok: true };
        } else {
            const msg = `HTTP ${response.status} ${response.statusText}`;
            console.error(`[Webhook] Error al enviar: ${msg}`);
            return { ok: false, error: msg };
        }
    } catch (error) {
        const msg = error.name === 'TimeoutError' ? 'Timeout (30s)' : error.message;
        console.error('[Webhook] Error de red:', msg);
        return { ok: false, error: msg };
    }
}

(async () => {
    const startTime = getUruguayTime();
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });

    try {
        if (process.env.SCRAPER_ONLY === 'veo') {
            const veoCasasResults = await scrapeVeoCasas(browser);
            const sample = veoCasasResults.slice(0, 15).map((r) => ({
                title: r.title,
                price: r.price,
                neighborhood: r.neighborhood,
                agency: r.agency,
                phone: r.phone,
                link: r.link
            }));
            console.log(JSON.stringify({ total: veoCasasResults.length, sample }, null, 2));
            return;
        }

        const portalErrors = [];

        const scrapePortal = async (name, fn) => {
            try {
                const results = await fn(browser);
                if (results.length === 0) {
                    portalErrors.push({ portal: name, severity: 'critical', message: `${name} devolvió 0 propiedades` });
                }
                return results;
            } catch (err) {
                portalErrors.push({ portal: name, severity: 'critical', message: `${name} crasheó: ${err.message}` });
                console.error(`[${name}] Error:`, err.message);
                return [];
            }
        };

        const [infoCasasResults, casasYMasResults, veoCasasResults] = await Promise.all([
            scrapePortal('InfoCasas', scrapeInfoCasas),
            scrapePortal('CasasYMas', scrapeCasasYMas),
            scrapePortal('VeoCasas', scrapeVeoCasas)
        ]);

        const { combined: infoCasasCombined, duplicates } = detectDuplicates(infoCasasResults, casasYMasResults);
        const combined = [...infoCasasCombined, ...veoCasasResults];
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

        const endTime = getUruguayTime();
        const durationMs = new Date(endTime).getTime() - new Date(startTime).getTime();
        if (durationMs > 10 * 60 * 1000) {
            portalErrors.push({ portal: 'system', severity: 'warning', message: `Scraping tardó ${Math.round(durationMs / 60000)} min (umbral: 10 min)` });
        }

        const webhookResult = await sendToN8N(finalResults, {
            total: finalResults.length,
            duplicates: duplicates.length,
            source_infocasas: infoCasasResults.length,
            source_casasymas: casasYMasResults.length,
            source_veocasas: veoCasasResults.length,
            start_time: startTime,
            end_time: endTime,
            duration_ms: durationMs,
            errors: portalErrors,
        });

        if (webhookResult && !webhookResult.ok) {
            portalErrors.push({ portal: 'webhook', severity: 'critical', message: `Webhook falló: ${webhookResult.error}` });
        }

        if (portalErrors.length > 0) {
            console.warn('[Alertas]', JSON.stringify(portalErrors, null, 2));
        }

    } catch (error) {
        console.error('Error general:', error);
    } finally {
        await browser.close();
    }
})();

