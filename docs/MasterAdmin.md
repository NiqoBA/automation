# Dashboard Master Admin - Inflexo AI

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Acceso al Dashboard](#acceso-al-dashboard)
3. [Funcionalidades Principales](#funcionalidades-principales)
4. [Invitar Clientes](#invitar-clientes)
5. [Gestionar Clientes](#gestionar-clientes)
6. [Ver Dashboard de Cliente](#ver-dashboard-de-cliente)
7. [Gestionar Invitaciones](#gestionar-invitaciones)
8. [Configuración de Emails](#configuración-de-emails)
9. [Troubleshooting](#troubleshooting)

---

## Introducción

El Dashboard Master Admin es el panel de control central desde donde se gestionan todas las organizaciones clientes del sistema. Solo usuarios con rol `master_admin` pueden acceder a estas funcionalidades.

### Características Principales

- **Vista general con métricas**: Total de clientes, usuarios, invitaciones pendientes
- **Gestión de clientes**: Ver, editar y acceder a dashboards de clientes
- **Sistema de invitaciones**: Invitar nuevos clientes vía email
- **Vista de cliente**: Ver el dashboard de cualquier cliente (modo vista)

---

## Acceso al Dashboard

### Requisitos

1. Usuario autenticado con rol `master_admin`
2. Perfil completo en la base de datos
3. Sesión activa en Supabase

### Rutas Disponibles

- `/dashboard/admin` - Dashboard principal con métricas
- `/dashboard/admin/clients` - Lista de clientes
- `/dashboard/admin/invitations` - Gestión de invitaciones
- `/dashboard/admin/client/[organizationId]` - Vista de dashboard de cliente
- `/dashboard/admin/settings` - Configuración (placeholder)

---

## Funcionalidades Principales

### Dashboard Principal (`/dashboard/admin`)

Muestra:

1. **Métricas en tiempo real**:
   - Total de Clientes (organizaciones activas)
   - Total de Usuarios (suma de todos los perfiles)
   - Invitaciones Pendientes
   - Clientes Activos este Mes (últimos 30 días)

2. **Tabla de Clientes**:
   - Nombre, RUT, País, Empleados, Usuarios, Fecha creación, Estado
   - Acciones: Ver Dashboard, Editar

### Lista de Clientes (`/dashboard/admin/clients`)

Vista completa de todas las organizaciones registradas con:
- Información detallada de cada cliente
- Filtros y búsqueda (futuro)
- Acciones rápidas

### Gestión de Invitaciones (`/dashboard/admin/invitations`)

Tabla con todas las invitaciones enviadas:
- Estado (Pendiente/Aceptada/Expirada)
- Email y empresa
- Fecha de envío y expiración
- Acciones: Copiar link, Reenviar, Cancelar

---

## Invitar Clientes

### Proceso de Invitación

1. **Hacer clic en "Invitar Cliente"** (botón en cualquier página del admin)

2. **Completar formulario**:
   - **Email del Admin del Cliente** (requerido): Email que recibirá la invitación
   - **Nombre del Cliente/Empresa** (requerido): Nombre de la organización
   - **Plan** (opcional): Starter, Professional, Enterprise
   - **Notas internas** (opcional): Información adicional

3. **Validaciones automáticas**:
   - Email no debe estar registrado
   - No debe haber invitación pendiente para ese email
   - Email debe ser válido

4. **Al enviar**:
   - Se crea registro en tabla `invitations`
   - Se genera token único
   - Se envía email con link de registro
   - Link expira en 7 días

### Flujo del Cliente Invitado

1. Cliente recibe email con link de registro
2. Hace clic en el link → `/auth/register/[token]`
3. Completa formulario de registro:
   - Email (pre-llenado, no editable)
   - Contraseña
   - Nombre completo
   - Teléfono (opcional)
   - Nombre de empresa (pre-llenado desde invitación)
   - RUT, País, Cantidad de empleados
4. Al completar:
   - Se crea usuario en Supabase Auth
   - Se crea organización con el nombre especificado
   - Se crea perfil vinculado a la organización
   - Se actualiza estado de invitación a "accepted"
   - Redirección automática a `/dashboard/admin`

---

## Gestionar Clientes

### Ver Lista de Clientes

Desde `/dashboard/admin/clients` puedes ver:
- Todas las organizaciones registradas
- Información básica de cada una
- Número de usuarios por organización
- Estado (activo/inactivo)

### Ver Dashboard de Cliente

1. Desde la tabla de clientes, hacer clic en el ícono de "Ver Dashboard"
2. O navegar a `/dashboard/admin/client/[organizationId]`

**Características del modo vista**:
- Banner indicando que estás en "modo vista"
- No puedes realizar cambios (solo lectura)
- Ves la información completa del cliente:
  - Datos de la organización
  - Lista de usuarios
  - Métricas (cuando se implementen)

### Editar Cliente

(Próximamente) Modal o página para editar:
- Nombre de la organización
- RUT
- País
- Cantidad de empleados
- Estado (activo/inactivo/suspendido)

---

## Ver Dashboard de Cliente

### Funcionalidad

El Master Admin puede ver el dashboard de cualquier cliente sin necesidad de "hacerse pasar" por ese usuario. Es un modo de **vista solamente** (no impersonation).

### Características

- **Banner de advertencia**: Indica claramente que estás en modo vista
- **Información completa**: Ves todo lo que el cliente vería
- **Solo lectura**: No puedes realizar cambios
- **Navegación fácil**: Botón para volver al dashboard admin

### Uso

1. Desde la tabla de clientes, hacer clic en "Ver Dashboard"
2. O navegar directamente a `/dashboard/admin/client/[organizationId]`
3. Ver información del cliente
4. Usar botón "← Volver a Admin" para regresar

---

## Gestionar Invitaciones

### Ver Todas las Invitaciones

Desde `/dashboard/admin/invitations` puedes ver:
- Todas las invitaciones enviadas (pendientes, aceptadas, expiradas)
- Email y empresa asociada
- Estado y fecha de expiración
- Acciones disponibles según el estado

### Acciones Disponibles

#### Para Invitaciones Pendientes

- **Copiar Link**: Copia el URL de registro al portapapeles
- **Reenviar**: Extiende la fecha de expiración y reenvía el email
- **Cancelar**: Marca la invitación como expirada

#### Para Invitaciones Aceptadas

- Solo visualización (ya fueron usadas)

#### Para Invitaciones Expiradas

- Solo visualización (ya no son válidas)

### Reenviar Invitación

1. Hacer clic en el botón "Reenviar" (ícono de refresh)
2. Se extiende la fecha de expiración 7 días más
3. Se reenvía el email (si está configurado)

### Cancelar Invitación

1. Hacer clic en el botón "Cancelar" (ícono X)
2. Confirmar acción
3. La invitación se marca como expirada
4. El link deja de funcionar

---

## Configuración de Emails

### Supabase Email Templates

El sistema utiliza Supabase Auth para enviar emails de invitación. 

#### Configuración Inicial

1. **Ir a Supabase Dashboard**:
   - Proyecto → Authentication → Email Templates
   - Seleccionar "Invite User"

2. **Personalizar Template**:
   - Usar el HTML proporcionado en la documentación técnica
   - Variables disponibles:
     - `{{ .Token }}` - Token de invitación
     - `{{ .SiteURL }}` - URL de tu aplicación
     - `{{ .Data.company_name }}` - Nombre de empresa (desde metadata)

3. **Configurar SMTP** (opcional):
   - Si quieres usar tu propio servidor SMTP
   - Settings → Auth → SMTP Settings

#### Template HTML Recomendado

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

### Envío de Emails (Implementación Actual)

**Nota**: Actualmente el sistema crea la invitación y genera el link, pero el envío automático de email está pendiente de implementación completa.

**Para testing**:
- El link de registro se muestra en la consola del servidor
- Puedes copiar el link manualmente desde la tabla de invitaciones
- El link funciona correctamente para registro

**Próximos pasos**:
- Integrar Supabase Auth `inviteUserByEmail` API
- O integrar servicio externo (Resend, SendGrid, etc.)
- Configurar webhooks para tracking de emails

---

## Troubleshooting

### No puedo acceder al dashboard admin

**Solución**:
1. Verifica que tu usuario tenga rol `master_admin` en la tabla `profiles`
2. Verifica que tengas sesión activa
3. Revisa la consola del navegador para errores

### Las invitaciones no se envían

**Solución**:
1. Verifica la configuración de SMTP en Supabase
2. Revisa los logs del servidor
3. Para testing, usa "Copiar Link" y envía manualmente

### El link de registro no funciona

**Posibles causas**:
1. La invitación expiró (7 días)
2. El token es inválido
3. La invitación ya fue aceptada

**Solución**:
- Reenviar la invitación desde la tabla de invitaciones
- Verificar que el token en la URL coincida con el de la base de datos

### No veo clientes en la lista

**Solución**:
1. Verifica que existan organizaciones en la base de datos
2. Verifica que no sean la organización del master admin
3. Revisa los logs de RLS si hay problemas de permisos

### Error al crear invitación

**Errores comunes**:
- "Email ya está registrado" → El usuario ya existe
- "Ya existe invitación pendiente" → Hay una invitación activa para ese email
- "Error al crear la invitación" → Revisa logs del servidor

---

## Mejoras Futuras

- [ ] Filtros y búsqueda en tabla de clientes
- [ ] Exportar lista de clientes a CSV
- [ ] Gráficos de crecimiento (clientes por mes)
- [ ] Actividad reciente (últimos logins)
- [ ] Notificaciones cuando cliente acepta invitación
- [ ] Sistema de planes/pricing con límites
- [ ] Facturación integrada
- [ ] Logs de auditoría (quién hizo qué)
- [ ] Edición de clientes desde el dashboard
- [ ] Suspensión/activación de clientes
- [ ] Dashboard de cliente con métricas reales

---

## Referencias

- [Documentación de Autenticación](./Login.md)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js App Router](https://nextjs.org/docs/app)
