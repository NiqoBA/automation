const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    try {
        console.log('Navigating to CasasYMas...');
        await page.goto('https://www.casasymas.com.uy/propiedad/247383-apartamento-en-venta-c-cochera-en-pocitos', { waitUntil: 'domcontentloaded', timeout: 30000 });

        const imageInfo = await page.evaluate(() => {
            // common selectors for images
            const ogImage = document.querySelector('meta[property="og:image"]');
            const mainImg = document.querySelector('.prop-slider img, .carousel-item.active img, .fotorama img, #slider-propiedades img');
            return {
                ogImage: ogImage ? ogImage.content : null,
                mainImg: mainImg ? mainImg.src : null
            };
        });

        console.log('Image Info:', imageInfo);
        fs.writeFileSync('casas_image_debug.json', JSON.stringify(imageInfo, null, 2));

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await browser.close();
    }
})();
