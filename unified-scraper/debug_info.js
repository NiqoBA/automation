const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    try {
        console.log('Navigating...');
        await page.goto('https://www.infocasas.com.uy/venta/inmuebles/montevideo/publicado-hoy', { waitUntil: 'domcontentloaded', timeout: 60000 });

        const nextData = await page.evaluate(() => {
            const el = document.getElementById('__NEXT_DATA__');
            return el ? el.innerHTML : null;
        });

        if (nextData) {
            const parsed = JSON.parse(nextData);
            console.log('pageProps keys:', Object.keys(parsed.props.pageProps));

            // Search for something that looks like listings
            let potentialListings = null;
            if (parsed.props.pageProps.listings) {
                potentialListings = parsed.props.pageProps.listings;
                console.log('Found .listings');
            } else if (parsed.props.pageProps.initialState && parsed.props.pageProps.initialState.listings) {
                potentialListings = parsed.props.pageProps.initialState.listings;
                console.log('Found .initialState.listings');
            } else {
                // FALLBACK: recursive search but excluding breadcrumbs/filters
                function findRealListings(obj, depth = 0) {
                    if (depth > 10 || !obj || typeof obj !== 'object') return null;
                    if (Array.isArray(obj) && obj.length > 5 && obj[0] && typeof obj[0] === 'object' && obj[0].id && obj[0].title && obj[0].price) return obj;
                    for (const key of Object.keys(obj)) {
                        if (['breadcrumbs', 'filters', 'meta', 'seo'].includes(key)) continue;
                        const result = findRealListings(obj[key], depth + 1);
                        if (result) return result;
                    }
                    return null;
                }
                potentialListings = findRealListings(parsed.props.pageProps);
            }

            if (potentialListings && potentialListings.length > 0) {
                console.log('Found listings array! Length:', potentialListings.length);
                console.log('Sample item structure:', JSON.stringify(potentialListings[0], null, 2));
                fs.writeFileSync('listing_debug.json', JSON.stringify(potentialListings[0], null, 2));
            } else {
                console.log('Could not find listings array. Dumping full data...');
                fs.writeFileSync('full_data_debug.json', JSON.stringify(parsed, null, 2));
            }

        } else {
            console.log('__NEXT_DATA__ not found');
        }
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await browser.close();
    }
})();
