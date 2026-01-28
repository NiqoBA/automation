# Integración del Scraper y Adaptación de Base de Datos

Este documento detalla los cambios realizados para integrar el scraper, automatizar su ejecución y asegurar la base de datos para un entorno multi-tenant.

## 1. Automatización con GitHub Actions

Se ha creado un flujo de trabajo de GitHub Actions para ejecutar el scraper diariamente.

- **Archivo**: `.github/workflows/scraper.yml`
- **Frecuencia**: Todos los días a las 22:00 (10:00 PM) (Hora Uruguay, UTC-3).
- **Acción**:
    1. Descarga el código del repositorio.
    2. Instala las dependencias en la carpeta `unified-scraper`.
    3. Ejecuta el script `index.js`.
    4. El script envía los resultados al webhook de n8n: `https://n8n.srv908725.hstgr.cloud/webhook/scraper`.

## 2. Base de Datos Multi-Tenant (Supabase)

Se ha auditado y configurado la base de datos `inflexo` en Supabase para asegurar el aislamiento de datos entre organizaciones (Multi-Tenancy) y soportar distintos tipos de proyectos.

### Cambios Realizados:
- **Seguridad (RLS)**: Se habilitó **Row Level Security (RLS)** en las tablas críticas `organizations` y `profiles`. Esto asegura que las políticas de acceso definidas sean efectivamente aplicadas y no ignoradas.
    - Antes: RLS estaba deshabilitado (riesgo de seguridad).
    - Ahora: RLS habilitado.
- **Estructura**:
    - La tabla `projects` ya cuenta con una columna `type` y `metadata`, lo que la hace flexible para soportar "todo tipo de proyectos" (no solo scrapeo).
    - La tabla `scraper_properties` está correctamente vinculada a `projects` mediante `project_id`, manteniendo la estructura jerárquica: `Organización -> Proyecto -> Datos`.

### Tablas Clave:
- `organizations`: Entidades principales (Clientes/Tenants).
- `projects`: Proyectos genéricos. El campo `type` define si es de scrapeo u otro tipo.
- `scraper_properties`: Datos específicos del scraper, vinculados a un proyecto.

## 3. Guía de Pruebas

### Probar el Scraper Localmente
Para verificar que el scraper funciona correctamente en tu máquina:

1. Abrir una terminal en la carpeta `unified-scraper`.
2. Instalar dependencias (si no lo has hecho):
   ```bash
   npm install
   ```
3. Ejecutar el script:
   ```bash
   node index.js
   ```
4. Verificar que se cree el archivo `reporte_final.txt` y que console log indique "Datos enviados exitosamente" al webhook.

### Probar la Automatización (GitHub Actions)
Para verificar que el flujo de GitHub funciona sin esperar a las 7:30 AM:

1. Sube los cambios a GitHub:
   ```bash
   git add .
   git commit -m "feat: Integrar scraper y workflow"
   git push
   ```
2. Ve a la pestaña **Actions** en tu repositorio de GitHub.
3. Selecciona el workflow **Daily Scraper** en la izquierda.
4. Haz clic en **Run workflow** (botón a la derecha) y selecciona la rama `main` (o la que estés usando).
5. Espera a que termine y verifica los logs para asegurar que se ejecutó correctamente.

### Verificar Webhook
- Revisa en tu n8n que el webhook haya recibido los datos tras la ejecución (local o remota).

## 4. Siguientes Pasos
- **Crear Proyecto en DB**: Asegúrate de que exista una fila en la tabla `projects` que represente este proyecto de Scrapeo. El script actual no inserta en DB, solo envía a n8n. Si n8n inserta en Supabase, necesitará el `project_id`.
- **Extensiones**: Si agregas nuevos tipos de proyectos, simplemente crea una nueva entrada en `projects` con el `type` adecuado y crea las tablas adicionales necesarias vinculadas por `project_id`.
