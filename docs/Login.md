# Sistema de Autenticación Multi-tenant - Inflexo AI

## Tabla de Contenidos

1. [Arquitectura General](#arquitectura-general)
2. [Estructura de Base de Datos](#estructura-de-base-de-datos)
3. [Flujos de Autenticación](#flujos-de-autenticación)
4. [Políticas RLS](#políticas-rls)
5. [Estructura de Rutas](#estructura-de-rutas)
6. [Server Actions](#server-actions)
7. [Componentes](#componentes)
8. [Guards y Middleware](#guards-y-middleware)
9. [Configuración Inicial](#configuración-inicial)
10. [Extensión del Sistema](#extensión-del-sistema)
11. [Troubleshooting](#troubleshooting)

---

## Arquitectura General

El sistema está construido sobre **Next.js 14 (App Router)** con **Supabase** como backend. Utiliza:

- **Autenticación**: Supabase Auth
- **Base de datos**: PostgreSQL (Supabase)
- **Seguridad**: Row Level Security (RLS) en todas las tablas
- **Validación**: Zod schemas
- **Formularios**: React Hook Form
- **Tipos**: TypeScript estricto

### Principios de Diseño

1. **Multi-tenant**: Cada organización tiene datos completamente aislados
2. **Seguridad por defecto**: RLS previene acceso no autorizado
3. **Escalabilidad**: Estructura preparada para crecimiento
4. **Mantenibilidad**: Código modular y bien documentado

---

## Estructura de Base de Datos

### Tablas Principales

#### `organizations`
Almacena información de cada organización/cliente.

```sql
- id (uuid, PK)
- name (text) - Nombre de la empresa
- rut (text, unique) - RUT único (formato Uruguay)
- country (text, default 'Uruguay')
- employee_count (text) - Rango de empleados
- created_at (timestamp)
- updated_at (timestamp)
```

#### `profiles`
Perfiles de usuario vinculados a `auth.users` de Supabase.

```sql
- id (uuid, PK, FK to auth.users)
- organization_id (uuid, FK to organizations)
- email (text)
- full_name (text)
- phone (text, nullable)
- role (enum: 'master_admin', 'org_admin', 'org_member')
- created_at (timestamp)
- updated_at (timestamp)
```

**Roles:**
- `master_admin`: Acceso total, puede ver todas las organizaciones
- `org_admin`: Administrador de su organización, puede invitar miembros
- `org_member`: Miembro regular, acceso limitado a su organización

#### `invitations`
Sistema de invitaciones para nuevos usuarios.

```sql
- id (uuid, PK)
- email (text) - Email del usuario invitado
- organization_id (uuid, FK to organizations)
- invited_by (uuid, FK to profiles) - Quién envió la invitación
- role (enum: 'org_admin', 'org_member') - Rol asignado
- token (text, unique) - Token único para registro
- status (enum: 'pending', 'accepted', 'expired')
- expires_at (timestamp) - Expiración (7 días por defecto)
- created_at (timestamp)
```

#### `organization_members`
Tabla de unión para relación muchos-a-muchos (permite usuarios en múltiples orgs en el futuro).

```sql
- id (uuid, PK)
- organization_id (uuid, FK to organizations)
- user_id (uuid, FK to profiles)
- role (enum: 'admin', 'member')
- created_at (timestamp)
- UNIQUE(organization_id, user_id)
```

### Enums

```sql
CREATE TYPE user_role AS ENUM ('master_admin', 'org_admin', 'org_member');
CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'expired');
CREATE TYPE org_member_role AS ENUM ('admin', 'member');
```

### Índices

Índices creados para optimizar consultas frecuentes:

- `idx_profiles_organization_id` - Búsqueda por organización
- `idx_profiles_email` - Búsqueda por email
- `idx_invitations_token` - Validación de tokens
- `idx_invitations_email` - Búsqueda de invitaciones por email
- `idx_organization_members_org_id` - Miembros por organización
- `idx_organization_members_user_id` - Organizaciones por usuario

---

## Flujos de Autenticación

### 1. Login

**Ruta**: `/auth/login`

**Flujo**:
1. Usuario ingresa email y contraseña
2. `signIn` server action valida credenciales con Supabase Auth
3. Si es válido, redirige a `/dashboard/admin`
4. Middleware refresca la sesión automáticamente

**Archivos**:
- `app/auth/login/page.tsx`
- `components/auth/LoginForm.tsx`
- `app/actions/auth.ts` (función `signIn`)

### 2. Registro con Invitación

**Ruta**: `/auth/register/[token]`

**Flujo**:
1. Usuario hace click en link de invitación (email)
2. Se valida el token en la base de datos
3. Si es válido, se muestra formulario con email pre-llenado
4. Usuario completa:
   - Contraseña
   - Nombre completo
   - Teléfono (opcional)
   - Nombre de empresa
   - Cantidad de empleados
   - RUT
   - País
5. Se crea:
   - Usuario en `auth.users` (Supabase Auth)
   - Perfil en `profiles`
   - Organización (si es `org_admin`)
   - Entrada en `organization_members`
   - Se actualiza `invitations.status` a 'accepted'
6. Redirige a dashboard

**Archivos**:
- `app/auth/register/[token]/page.tsx`
- `components/auth/RegisterForm.tsx`
- `app/actions/register.ts` (función `registerWithInvitation`)

### 3. Invitación de Usuarios

**Rutas**: 
- `/dashboard/admin/invitations` (master admin)

**Flujo**:
1. Admin ingresa email y selecciona rol
2. Se valida que el email no esté registrado
3. Se valida que no haya invitación pendiente
4. Se genera token único
5. Se crea registro en `invitations` con expiración de 7 días
6. **TODO**: Enviar email con link (actualmente se retorna URL para desarrollo)

**Archivos**:
- `app/actions/invitations.ts` (función `createInvitation`)
- `components/invitations/InviteUserForm.tsx`

---

## Políticas RLS

Todas las tablas tienen RLS habilitado. Las políticas garantizan:

### Organizations

1. **Master admin puede ver todas**: Cualquier usuario con `role = 'master_admin'` puede ver todas las organizaciones
2. **Usuarios ven su organización**: Solo pueden ver la organización a la que pertenecen
3. **Solo master admin puede crear**: Solo master admin puede insertar nuevas organizaciones

### Profiles

1. **Usuarios ven su propio perfil**: `id = auth.uid()`
2. **Usuarios ven perfiles de su organización**: Basado en `organization_id`
3. **Master admin ve todos**: Acceso total para master admin
4. **Usuarios pueden actualizar su perfil**: Solo su propio perfil

### Invitations

1. **Usuarios ven invitaciones de su organización**: Basado en `organization_id`
2. **Master admin ve todas**: Acceso total
3. **Solo admins pueden crear**: `role IN ('master_admin', 'org_admin')`
4. **Solo admins pueden actualizar**: Mismo criterio

### Organization Members

1. **Usuarios ven miembros de su organización**: Basado en `organization_id`
2. **Master admin ve todos**: Acceso total

**Nota importante**: Las políticas RLS se evalúan en cada query. Si una política falla, la query retorna vacío (no error), por lo que es crucial probar los permisos.

---

## Estructura de Rutas

### Rutas Públicas

```
/auth/login          - Página de login
/auth/register/[token] - Registro con token de invitación
```

### Rutas Protegidas - Master Admin

```
/dashboard/admin/organizations - Lista de todas las organizaciones
/dashboard/admin/invitations   - Gestión de invitaciones (puede invitar nuevas orgs)
```

### Rutas Protegidas - Master Admin

```
/dashboard/admin            - Dashboard principal Master Admin
/dashboard/admin/clients    - Gestión de clientes
/dashboard/admin/invitations - Gestión de invitaciones
/dashboard/admin/client/[id] - Vista de dashboard de cliente
/dashboard/admin/settings   - Configuración (placeholder)
```

**Protección**: Todas las rutas `/dashboard/*` requieren autenticación mediante guards.

---

## Server Actions

### Auth Actions (`app/actions/auth.ts`)

#### `signIn(email, password)`
- Valida credenciales con Supabase Auth
- Redirige a dashboard si exitoso
- Retorna error si falla

#### `signOut()`
- Cierra sesión en Supabase
- Limpia cookies
- Redirige a login

#### `getCurrentUser()`
- Obtiene usuario actual de Supabase Auth
- Incluye perfil de la base de datos
- Retorna `null` si no autenticado

#### `getCurrentUserProfile()`
- Obtiene perfil completo con organización
- Incluye datos de la organización asociada

### Invitation Actions (`app/actions/invitations.ts`)

#### `createInvitation(email, role)`
- Valida permisos del usuario actual
- Verifica que email no esté registrado
- Verifica que no haya invitación pendiente
- Genera token único
- Crea registro con expiración de 7 días
- Retorna URL de invitación (para desarrollo)

#### `getInvitationByToken(token)`
- Valida token en base de datos
- Verifica que no esté expirado
- Retorna datos de invitación con organización

#### `getInvitations()`
- Lista invitaciones según permisos
- Master admin ve todas
- Org admin ve solo de su organización

### Register Actions (`app/actions/register.ts`)

#### `registerWithInvitation(...)`
- Valida token de invitación
- Verifica expiración
- Crea usuario en Supabase Auth
- Crea organización si es `org_admin`
- Crea perfil
- Agrega a `organization_members`
- Actualiza estado de invitación
- Redirige a dashboard

### Organization Actions (`app/actions/organizations.ts`)

#### `getOrganizations()`
- Solo master admin
- Retorna todas las organizaciones con perfiles asociados

#### `getOrganizationMembers(organizationId)`
- Valida acceso a organización
- Retorna miembros con perfiles

---

## Componentes

### Auth Components

#### `LoginForm` (`components/auth/LoginForm.tsx`)
- Formulario de login con validación Zod
- Manejo de errores
- Loading states
- Integrado con React Hook Form

#### `RegisterForm` (`components/auth/RegisterForm.tsx`)
- Formulario completo de registro
- Email pre-llenado (no editable)
- Validación de RUT (formato Uruguay)
- Dropdowns para empleados y país
- Carga invitación al montar

### Invitation Components

#### `InviteUserForm` (`components/invitations/InviteUserForm.tsx`)
- Formulario para invitar usuarios
- Selección de rol (admin/member)
- Validación de email
- Feedback de éxito/error

---

## Guards y Middleware

### Guards (`lib/auth/guards.tsx`)

Funciones para proteger rutas:

#### `requireAuth()`
- Verifica que usuario esté autenticado
- Redirige a login si no

#### `requireProfile()`
- Requiere autenticación + perfil en BD
- Retorna `{ user, profile }`

#### `requireRole(allowedRoles)`
- Verifica que usuario tenga uno de los roles permitidos
- Redirige si no tiene permisos

#### `requireMasterAdmin()`
- Atajo para `requireRole(['master_admin'])`

#### `requireOrgAccess(organizationId)`
- Verifica acceso a organización específica
- Master admin tiene acceso a todas

### Middleware (`middleware.ts`)

- Refresca sesión de Supabase automáticamente
- Maneja cookies de sesión
- Se ejecuta en todas las rutas excepto estáticas

---

## Configuración Inicial

### 1. Variables de Entorno

Ya configuradas en `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://aznfhrtfxlsymzygkppa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 2. Base de Datos

Las migraciones están en `supabase/migrations/`:
- `001_initial_schema.sql` - Tablas y estructura
- `002_rls_policies.sql` - Políticas RLS

**Estado**: Ya aplicadas mediante MCP.

### 3. Crear Usuario Master Admin

**Proceso Manual (Recomendado)**

1. Crea tu cuenta en Supabase Auth:
   - Ve a Supabase Dashboard > Authentication > Users
   - Click en "Add user" o crea desde la API
   - Ingresa email y contraseña
   - Copia el `user_id` que se genera

2. Ejecuta este SQL en SQL Editor de Supabase (reemplaza los valores):

```sql
-- Crear organización principal "Inflexo AI"
INSERT INTO organizations (name, rut, country, employee_count)
VALUES ('Inflexo AI', '00000000-0', 'Uruguay', '1-10')
ON CONFLICT (rut) DO NOTHING;

-- Crear perfil master admin (reemplaza los valores)
DO $$
DECLARE
  org_id UUID;
  v_user_id UUID := 'TU_USER_ID_AQUI'; -- Tu user_id de auth.users
  user_email TEXT := 'TU_EMAIL@example.com'; -- Tu email
  user_name TEXT := 'Tu Nombre Completo'; -- Tu nombre
BEGIN
  SELECT id INTO org_id FROM organizations WHERE name = 'Inflexo AI' LIMIT 1;
  
  INSERT INTO profiles (id, organization_id, email, full_name, role)
  VALUES (v_user_id, org_id, user_email, user_name, 'master_admin')
  ON CONFLICT (id) DO UPDATE
  SET role = 'master_admin',
      organization_id = org_id,
      email = user_email,
      full_name = user_name;
  
  INSERT INTO organization_members (organization_id, user_id, role)
  VALUES (org_id, v_user_id, 'admin')
  ON CONFLICT (organization_id, user_id) DO UPDATE
  SET role = 'admin';
END $$;
```

### 4. Configurar Email (Supabase Dashboard)

1. Ve a Authentication > Email Templates
2. Personaliza templates de:
   - Confirmación de email
   - Invitación (si usas email de Supabase)
   - Reset de contraseña

3. Configura SMTP si quieres emails personalizados:
   - Settings > Auth > SMTP Settings

### 5. Configurar Google OAuth (Opcional)

1. Ve a Authentication > Providers > Google
2. Habilita Google
3. Agrega Client ID y Secret de Google Cloud Console
4. Agrega callback URL: `https://aznfhrtfxlsymzygkppa.supabase.co/auth/v1/callback`

---

## Extensión del Sistema

### Agregar Nuevos Roles

1. Actualizar enum en migración:
```sql
ALTER TYPE user_role ADD VALUE 'nuevo_rol';
```

2. Actualizar tipos TypeScript:
```typescript
export type UserRole = 'master_admin' | 'org_admin' | 'org_member' | 'nuevo_rol'
```

3. Actualizar políticas RLS si es necesario
4. Actualizar guards y validaciones

### Agregar Campos a Perfiles

1. Crear migración:
```sql
ALTER TABLE profiles ADD COLUMN nuevo_campo TEXT;
```

2. Actualizar tipos TypeScript
3. Actualizar formularios si aplica

### Agregar Nuevas Rutas Protegidas

1. Crear página en `app/dashboard/...`
2. Usar guard apropiado:
```typescript
import { requireProfile } from '@/lib/auth/guards'

export default async function NuevaPage() {
  const { profile } = await requireProfile()
  // ...
}
```

### Integrar Email Real

Actualmente las invitaciones retornan la URL. Para producción:

1. Configurar servicio de email (SendGrid, Resend, etc.)
2. Crear server action para enviar emails
3. Actualizar `createInvitation` para enviar email automáticamente
4. Template de email debe incluir: `{invitationUrl}`

Ejemplo con Resend:
```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: 'Inflexo AI <noreply@inflexo.ai>',
  to: email,
  subject: 'Invitación a Inflexo AI',
  html: `<p>Has sido invitado. <a href="${invitationUrl}">Completa tu registro</a></p>`
})
```

---

## Sistema de Emails de Invitación

### Configuración en Supabase

El sistema utiliza Supabase Auth para enviar emails de invitación a nuevos clientes.

#### Pasos para Configurar

1. **Ir a Supabase Dashboard**:
   - Navega a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
   - Ve a **Authentication** → **Email Templates**
   - Selecciona el template **"Invite User"**

2. **Personalizar Template HTML**:
   ```html
   <div style="font-family: system-ui; max-width: 600px; margin: 0 auto;">
     <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
       <h1 style="color: white; margin: 0;">Inflexo AI</h1>
     </div>
     
     <div style="padding: 40px; background: #1a1a1a; color: #fff;">
       <h2 style="margin-top: 0;">Has sido invitado a Inflexo AI</h2>
       <p>Hola,</p>
       <p>Has sido invitado a unirte a Inflexo AI como administrador de <strong>{{ .Data.company_name }}</strong>.</p>
       
       <p>Para completar tu registro y acceder a tu dashboard, haz clic en el botón de abajo:</p>
       
       <div style="text-align: center; margin: 30px 0;">
         <a href="{{ .SiteURL }}/auth/register/{{ .Token }}" 
            style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                   color: white; 
                   padding: 15px 40px; 
                   text-decoration: none; 
                   border-radius: 8px; 
                   display: inline-block;">
           Completar Registro
         </a>
       </div>
       
       <p style="color: #999; font-size: 14px;">
         Este enlace expira en 7 días.<br>
         Si no solicitaste esta invitación, puedes ignorar este email.
       </p>
     </div>
     
     <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
       © 2025 Inflexo AI - Automatización Inteligente
     </div>
   </div>
   ```

3. **Variables Disponibles**:
   - `{{ .Token }}` - Token único de la invitación
   - `{{ .SiteURL }}` - URL base de tu aplicación (configurar en `.env.local` como `NEXT_PUBLIC_SITE_URL`)
   - `{{ .Data.company_name }}` - Nombre de la empresa (desde metadata de la invitación)

4. **Configurar SMTP (Opcional)**:
   - Si quieres usar tu propio servidor SMTP:
   - Ve a **Settings** → **Auth** → **SMTP Settings**
   - Configura tu servidor SMTP personalizado

### Implementación Actual

**Nota**: El sistema actualmente crea las invitaciones y genera los links correctamente, pero el envío automático de emails está pendiente de implementación completa.

**Para testing**:
- El link de registro se genera y se guarda en la base de datos
- Puedes copiar el link desde la tabla de invitaciones en el dashboard admin
- El link funciona correctamente para el registro

**Próximos pasos para envío automático**:
1. Integrar Supabase Auth `admin.inviteUserByEmail()` API
2. O integrar servicio externo como Resend/SendGrid
3. Configurar webhooks para tracking

### Metadata de Invitaciones

Las invitaciones almacenan información adicional en el campo `metadata` (JSONB):

```typescript
{
  company_name: string      // Nombre de la empresa
  plan?: string             // Plan seleccionado (Starter/Professional/Enterprise)
  notes?: string            // Notas internas
}
```

Esta metadata se usa para:
- Pre-llenar el nombre de empresa en el formulario de registro
- Tracking interno
- Personalización de emails

---

## Troubleshooting

### Error: "policy violation" o queries vacías

**Causa**: RLS está bloqueando acceso.

**Solución**:
1. Verificar que el usuario tenga perfil en `profiles`
2. Verificar que `organization_id` esté correcto
3. Revisar políticas RLS en Supabase Dashboard
4. Usar `supabase.auth.getUser()` para verificar `auth.uid()`

### Error: "invitation not found" o "expired"

**Causa**: Token inválido o expirado.

**Solución**:
1. Verificar que el token existe en `invitations`
2. Verificar que `status = 'pending'`
3. Verificar que `expires_at > NOW()`
4. Regenerar invitación si es necesario

### Error: "profile not found" después de registro

**Causa**: Perfil no se creó correctamente.

**Solución**:
1. Verificar que `auth.users` tiene el usuario
2. Verificar que `profiles` tiene entrada con `id = user.id`
3. Revisar logs de Supabase para errores de inserción
4. Verificar políticas RLS de INSERT en `profiles`

### Sesión no persiste

**Causa**: Problemas con cookies o middleware.

**Solución**:
1. Verificar que middleware está configurado correctamente
2. Verificar cookies en DevTools
3. Verificar que `NEXT_PUBLIC_SUPABASE_URL` y `ANON_KEY` están correctos
4. Limpiar cookies y volver a login

### Master admin no puede ver organizaciones

**Causa**: Perfil no tiene `role = 'master_admin'`.

**Solución**:
1. Verificar en `profiles`: `SELECT * FROM profiles WHERE id = 'TU_USER_ID'`
2. Si no es master_admin, actualizar:
```sql
UPDATE profiles SET role = 'master_admin' WHERE id = 'TU_USER_ID';
```

### Usuario no puede ver su organización

**Causa**: `organization_id` es NULL o incorrecto.

**Solución**:
1. Verificar perfil: `SELECT organization_id FROM profiles WHERE id = 'USER_ID'`
2. Si es NULL, asignar organización:
```sql
UPDATE profiles 
SET organization_id = 'ORG_ID' 
WHERE id = 'USER_ID';
```

---

## Decisiones Arquitectónicas

### ¿Por qué `organization_members` además de `profiles.organization_id`?

La tabla `organization_members` permite:
- Usuarios en múltiples organizaciones (futuro)
- Historial de membresías
- Roles diferentes por organización
- Mejor escalabilidad

Actualmente `profiles.organization_id` es la organización principal, pero `organization_members` es la fuente de verdad para membresías.

### ¿Por qué RLS en lugar de validación en código?

RLS garantiza seguridad a nivel de base de datos:
- No se puede bypassear desde código
- Funciona incluso con acceso directo a BD
- Menos código de validación necesario
- Mejor performance (filtrado en BD)

### ¿Por qué Server Actions en lugar de API Routes?

- Menos boilerplate
- Type-safe end-to-end
- Mejor integración con React Server Components
- Simplicidad para operaciones CRUD

---

## Próximos Pasos

1. **Email real**: Integrar servicio de email para invitaciones
2. **Dashboard funcional**: Reemplazar placeholders con contenido real
3. **Gestión de equipo**: Implementar funcionalidades de equipo en dashboard admin
4. **Configuración**: Implementar `/dashboard/admin/settings`
5. **Reset de contraseña**: Agregar flujo completo
6. **Google OAuth**: Integrar login con Google
7. **Auditoría**: Agregar logs de acciones importantes
8. **Notificaciones**: Sistema de notificaciones en-app

---

## Contacto y Soporte

Para preguntas o problemas:
- Revisar esta documentación primero
- Verificar logs de Supabase Dashboard
- Revisar políticas RLS en Supabase
- Consultar documentación de Supabase: https://supabase.com/docs

---

**Última actualización**: Enero 2025
**Versión**: 1.0.0
