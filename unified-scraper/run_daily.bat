@echo off
cd /d "c:\Users\nicov\Documents\Niqo\Scraper\unified-scraper"

:: Configura tu URL de n8n aqui si no quieres usar variables de entorno globales
:: set N8N_WEBHOOK=https://tu-n8n.com/webhook/test

echo Ejecutando scraper diario...
node index.js
echo Finalizado.
pause
