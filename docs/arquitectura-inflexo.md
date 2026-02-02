# Arquitectura Inflexo - Plataforma de Transformación Digital

> **Versión:** 1.0  
> **Estado:** En producción — NO romper flujos existentes  
> **Principio rector:** Estabilidad sobre elegancia, cambios incrementales y reversibles.

---

## 1. Visión General

### Diagrama textual

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           USUARIOS / NAVEGADOR                                    │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         CORE APP (Next.js / Vercel)                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Auth         │  │ Dashboard UI │  │ Gestión      │  │ Estado de            │  │
│  │ Login/Logout │  │ Props, Logs  │  │ Clientes     │  │ automatizaciones     │  │
│  │ Sesiones     │  │ Tickets      │  │ Proyectos    │  │ (solo lectura/poll)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                                                                                   │
│  ❌ NO ejecuta: scraping, consolidación pesada, ETL, IA, integraciones largas     │
└─────────────────────────────────────────────────────────────────────────────────┘
        │                           │                              │
        │                           │                              │
        ▼                           ▼                              ▼
┌──────────────┐          ┌─────────────────────┐          ┌─────────────────────┐
│   Supabase   │          │  Job Queue (jobs)   │          │  Workers externos   │
│   Auth + DB  │          │  Estados, metadata  │          │  (GitHub Actions,   │
│   RLS        │          │  Reintentos         │          │   n8n, scripts)     │
└──────────────┘          └─────────────────────┘          └─────────────────────┘
        │                                   │                              │
        │                                   ▼                              │
        │                          ┌─────────────────────┐                 │
        └──────────────────────────│  Worker process     │◄────────────────┘
                                   │  (consolidar, ETL)  │
                                   └─────────────────────┘
```

### Principios clave

1. **Aislamiento** — La Core App nunca bloquea por tareas pesadas.
2. **Desacoplamiento** — Workers y automatizaciones corren fuera del request/response.
3. **Compatibilidad** — Todo flujo existente sigue funcionando; lo nuevo es opt-in.
4. **Reversibilidad** — Cualquier cambio puede desactivarse sin romper nada.
5. **Escalabilidad** — Diseño preparado para más clientes y más automatizaciones.

---

## 2. Separación de Responsabilidades

### Core App (App Principal)

| Responsabilidad | Ubicación | Descripción |
|-----------------|-----------|-------------|
| **Autenticación** | `app/auth/`, `contexts/AuthContext.tsx` | Login, registro, sesión Supabase |
| **Autorización** | `lib/auth/guards.tsx` | `requireProfile`, `requireMasterAdmin`, RLS |
| **UI / Dashboard** | `app/dashboard/`, `components/` | Vistas de proyectos, propiedades, logs, tickets |
| **Gestión de clientes** | `app/actions/master-admin.ts`, `organizations.ts` | CRUD organizaciones, invitaciones |
| **Estado de automatizaciones** | `project-actions.ts` (getters) | Consultas a `scraper_logs`, `scraper_properties` |
| **Logs y métricas** | `project-actions.ts`, vistas | Lectura de logs, estadísticas |

**Regla:** La Core App solo ejecuta operaciones que completan en menos de unos segundos. No scraping, no consolidaciones masivas, no ETL pesado.

---

### Workers (Ejecución pesada aislada)

| Worker | Ubicación actual | Trigger | Descripción |
|--------|------------------|---------|-------------|
| **Web Scraping** | `unified-scraper/` | GitHub Actions (cron diario) | Puppeteer + Cheerio, InfoCasas, CasasYMas |
| **Consolidación de duplicados** | `project-actions.ts` → migrar a worker | Job Queue | Consolidar duplicados en `scraper_properties` |
| **n8n / Integraciones** | Externo | Webhook desde scraper | ETL, envío a Supabase, integraciones |

**Regla:** Cada automatización debe ejecutarse como proceso/job independiente. No bloquea el dashboard.

---

### Orquestación

| Componente | Función | Estado |
|------------|---------|--------|
| **Job Queue** | Tabla `jobs` en Supabase | Migración `019_job_queue.sql` |
| **Estados de jobs** | `pending`, `running`, `completed`, `failed` | Definido en schema |
| **Reintentos** | `attempts`, `max_attempts` | Soporte en schema |
| **Worker script** | `scripts/run-jobs.ts` | Modo `--once` para event-driven |
| **n8n** | Orquestación scraper → DB | Ya en producción |

---

## 3. Flujo Completo de una Automatización

### Ejemplo: Web Scraping (actual)

```
1. GitHub Actions (cron 21:00 UY)
   └─> Ejecuta unified-scraper/index.js
2. Scraper (Puppeteer)
   └─> Extrae InfoCasas + CasasYMas
3. Scraper envía POST a n8n webhook
4. n8n procesa y escribe en Supabase (scraper_properties, scraper_logs)
5. Dashboard lee desde Supabase (project-actions.ts)
   └─> Usuario ve propiedades actualizadas
```

### Ejemplo: Consolidar duplicados (flujo event-driven)

```
1. Usuario hace clic en "Consolidar duplicados en DB"
2. Core App llama a enqueueConsolidateDuplicates(projectId)
   └─> Inserta job en tabla `jobs`, retorna job_id
   └─> Dispara repository_dispatch (job-enqueued) a GitHub API
3. UI muestra "Consolidación en curso..." y hace poll de estado
4. GitHub Actions recibe el evento y ejecuta npm run jobs:worker:once
   └─> Procesa TODOS los jobs pendientes secuencialmente
   └─> Actualiza cada job a completed/failed
5. UI detecta completed y refresca datos
```

**Flujo legado (compatibilidad):** Si el dispatch falla o no está configurado, el fallback síncrono sigue disponible tras ~2 min de polling.

---

## 4. Cómo Agregar un Nuevo Cliente

### Qué se configura

1. **Organización** — Creada desde Master Admin o invitación.
2. **Proyectos** — Uno o más proyectos por organización (`projects`).
3. **Usuarios** — Invitados o registrados, vinculados a la organización.
4. **Proyecto de scraping** — Si aplica, proyecto con `type` adecuado y `project_id` configurado en n8n/scraper.

### Qué se reutiliza

- Auth, RLS, perfiles.
- Dashboard, vistas de propiedades, logs.
- Workers existentes (scraper, n8n).
- Job Queue (para tareas pesadas nuevas).

### Qué NO debe hacerse

- No ejecutar lógica pesada en Server Actions llamadas desde el dashboard.
- No modificar RLS sin revisar impacto en clientes existentes.
- No eliminar columnas o tablas sin migración de datos.

---

## 5. Cómo Agregar una Nueva Automatización

### Checklist técnico

- [ ] Definir si la automatización es **ligera** (≈ segundos) o **pesada** (minutos o más).
- [ ] Si es pesada: crear **Job** en tabla `jobs` con `type` único.
- [ ] Implementar **Worker** que consuma jobs de ese tipo (script, Edge Function, o servicio externo).
- [ ] En la Core App: solo **enqueue** el job y mostrar estado (poll o WebSocket si se implementa).
- [ ] Documentar trigger (repository_dispatch, manual, cron backup).
- [ ] Configurar reintentos y manejo de errores en el worker.
- [ ] Agregar logging en `scraper_logs` o tabla equivalente si aplica.

### Buenas prácticas

1. **Idempotencia** — El job debe poder reintentarse sin efectos secundarios duplicados.
2. **Timeouts** — Definir timeout máximo por tipo de job.
3. **Métricas** — Registrar duración, éxito/fallo, para observabilidad.
4. **Aislamiento por proyecto** — Jobs llevan `project_id` cuando aplica.
5. **No bloquear** — Nunca ejecutar la lógica pesada dentro del request HTTP.

---

## 6. Antipatrones Prohibidos

### Qué rompe la escalabilidad

| Antipatrón | Ejemplo | Consecuencia |
|------------|---------|--------------|
| Ejecutar scraping en Server Action | `await scrapeWebsite()` dentro de `project-actions.ts` | Request bloqueado, timeouts, app inestable |
| Consolidación masiva síncrona | `consolidateDuplicateProperties` con 50k filas en un request | CPU/memoria saturados, usuario espera minutos |
| Queries sin paginación | `SELECT *` sin límite en proyectos grandes | Memoria y latencia altas |
| Lógica pesada en API Route | ETL en `app/api/...` | Mismo problema que Server Action |
| Workers que escriben sin transacciones | Múltiples updates sin atomicidad | Datos inconsistentes |

### Qué nunca ejecutar en la app principal

- Puppeteer, Playwright, Selenium.
- Llamadas a LLMs/IA que pueden tardar >10s.
- Procesamiento de archivos grandes (>1MB) en memoria.
- Loops que hacen muchas operaciones de DB (miles de updates en un request).
- Integraciones que hacen polling o esperas largas.

---

## 7. Estrategia de Escalado

### Vertical

- Aumentar recursos del Worker (más CPU/RAM para el script de jobs).
- Optimizar queries en Core App (índices, paginación estricta).
- Aumentar límites de Supabase si es necesario.

### Horizontal

- Múltiples instancias del Worker procesando la cola (con bloqueo por fila para evitar duplicados).
- Workers por tipo de job (uno para consolidación, otro para scraping, etc.).
- Separar proyectos grandes en workers dedicados si se requiere.

### Aislamiento por cliente

- Si un cliente requiere cargas muy pesadas: proyecto con `metadata` que indique worker dedicado.
- Tabla `jobs` ya filtra por `project_id`.
- Futuro: colas separadas por organización si el volumen lo justifica.

---

## 8. Glosario y Referencias

- **Core App:** Aplicación Next.js principal (login, dashboard, gestión).
- **Worker:** Proceso independiente que ejecuta jobs pesados.
- **Job Queue:** Tabla `jobs` + lógica de enqueue/process.
- **n8n:** Herramienta de automatización externa (webhooks, ETL).
- **RLS:** Row Level Security (Supabase).

### Archivos clave

| Archivo | Propósito |
|---------|-----------|
| `app/actions/project-actions.ts` | Acciones de proyecto (algunas delegables a workers) |
| `app/actions/master-admin.ts` | Admin, clientes, proyectos |
| `unified-scraper/index.js` | Worker de scraping |
| `lib/jobs/queue.ts` | Enqueue y consulta de estado |
| `lib/jobs/tasks/consolidate-duplicates.ts` | Lógica de consolidación (reutilizable) |
| `lib/jobs/worker-utils.ts` | Utilidades del worker (NO usar en Core App) |
| `scripts/run-jobs.ts` | Worker de jobs (`npm run jobs:worker:once` en GitHub Actions) |
| `lib/jobs/dispatch.ts` | Dispara repository_dispatch al encolar (best-effort) |
| `supabase/migrations/019_job_queue.sql` | Schema de jobs |

---

## 9. Modelo Event-Driven con GitHub Actions

### Diagrama del flujo

```
Usuario → clic "Consolidar"
    │
    ▼
enqueueConsolidateDuplicates(projectId)
    │
    ├─> INSERT en tabla jobs
    │
    └─> POST repository_dispatch (job-enqueued)  [best-effort, no bloquea]
            │
            ▼
    GitHub Actions recibe evento
            │
            ▼
    npm run jobs:worker:once
            │
            ▼
    Procesa todos los jobs pendientes → jobs completados
```

### Ventajas

- **0 costo** — Dentro del free tier de GitHub Actions
- **Latencia baja** — El workflow corre en segundos tras el enqueue
- **Escalable** para pocos clientes
- **Sin VPS** — No requiere servidor ni worker en loop

### Limitaciones (honestas)

- No apto para alta concurrencia (cientos de jobs/minuto)
- Dependencia de GitHub Actions
- El cron diario de backup puede no alcanzar si el dispatch falla y hay jobs críticos

---

## 10. Configuración del Worker de Jobs

El modelo principal es **event-driven**: cada enqueue dispara el workflow. No se usa cron frecuente.

### Secretos en GitHub (Settings → Secrets and variables → Actions)

| Secreto | Descripción |
|---------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (bypass RLS) |

### Variables en el backend (Vercel / .env.local)

| Variable | Descripción |
|----------|-------------|
| `GH_DISPATCH_TOKEN` | GitHub Personal Access Token (permiso `repo`) |
| `GITHUB_REPO` | Repositorio en formato `owner/repo` (ej: `tu-org/landing`) |

### Modos del worker

| Comando | Comportamiento |
|---------|----------------|
| `npm run jobs:worker` | Procesa 1 job y termina (legado) |
| `npm run jobs:worker:once` | Procesa TODOS los jobs pendientes y termina (principal) |

### Cron de backup (opcional)

El workflow incluye un cron diario (12:00 UTC) como respaldo. Si el dispatch falla, los jobs pendientes se procesarán en la próxima ejecución del cron.

---

## 11. Escalado futuro

| Fase | Modelo | Cuándo |
|------|--------|--------|
| **Actual** | GitHub Actions event-driven | Pocos clientes, pocos jobs |
| **Intermedia** | Múltiples workflows concurrentes | Más jobs, mismo código |
| **Avanzada** | Worker en loop / VPS / containers | Alta concurrencia |
| **Premium** | Workers aislados por cliente | Clientes con SLA estricto |

No se requiere modificar código para pasar de fase 1 a 2: el mismo `repository_dispatch` puede disparar workflows paralelos si GitHub lo permite.

---

## 12. Próximos pasos (Checklist)

Manual operativo para poner en marcha el modelo event-driven:

- [ ] **Crear GitHub Personal Access Token**
  - GitHub → Settings → Developer settings → Personal access tokens
  - Permisos mínimos: `repo` (o solo el scope necesario para `repository_dispatch`)
  - Copiar el token

- [ ] **Guardar secretos en GitHub**
  - Repo → Settings → Secrets and variables → Actions
  - Crear `GH_DISPATCH_TOKEN` con el PAT
  - Verificar que existan `NEXT_PUBLIC_SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`

- [ ] **Configurar variables en el backend**
  - En Vercel (o donde hostees): Variables de entorno
  - `GH_DISPATCH_TOKEN` = (el PAT)
  - `GITHUB_REPO` = `owner/repo` (ej: `nicov/landing`)

- [ ] **Verificar workflow**
  - El archivo `.github/workflows/jobs-worker.yml` debe existir
  - Debe escuchar `repository_dispatch` con tipo `job-enqueued`

- [ ] **Probar el flujo**
  1. Hacer clic en "Consolidar duplicados en DB"
  2. En GitHub Actions, verificar que se disparó un run
  3. Verificar que el job pasó a `completed`

- [ ] **Monitorear consumo**
  - GitHub → Insights → Actions
  - Verificar que no se supere el límite mensual (~2000 min free tier)

- [ ] **(Opcional) Cron diario de respaldo**
  - Ya está en el workflow (`0 12 * * *`)
  - Puede ajustarse o desactivarse según necesidad

---

*Documento vivo. Actualizar al introducir nuevas automatizaciones o cambios arquitectónicos.*
