# Scraper Unificado (InfoCasas + Casas y Más)

Este scraper unificado combina las publicaciones de **InfoCasas** y **Casas y Más** en un solo reporte, eliminando (o marcando) automáticamente las propiedades que aparecen en ambos portales.

## Estrategia de De-duplicación
Para detectar si una propiedad es la misma en ambos sitios, el script analiza el "Match de 3 puntos":
1.  **Barrio Identico**: Se normalizan los nombres de los barrios.
2.  **Precio exacto**: Comparación del monto en la misma moneda.
3.  **Atributos Coincidentes**: Verifica que tengan la misma cantidad de dormitorios o una superficie (m²) muy similar (margen de error de 2m²).

## Instalación

1.  Asegúrate de estar en la carpeta del proyecto:
    ```bash
    cd c:/Users/nicov/Documents/Niqo/Scraper/unified-scraper
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```

## Uso

Ejecuta el script unificado:
```bash
node index.js
```

Para guardar los resultados en un archivo:
```bash
node index.js > reporte_final.txt
```

## Salida del Script
El script mostrará un reporte consolidado. Si detecta un posible duplicado, verás una advertencia:
`#X [⚠️ DUPLICADO]`
`Visto también en: [link al otro portal]`

---
**Nota:** El script de InfoCasas busca lo publicado "Ayer" y Casas y Más lo publicado "Hoy" según los enlaces proporcionados.
