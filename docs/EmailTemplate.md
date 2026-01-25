# Template de Email de Invitación - Inflexo AI

## Configuración en Supabase

Para configurar el template de email de invitación:

1. Ve a **Supabase Dashboard** → **Authentication** → **Email Templates**
2. Selecciona **"Invite User"**
3. Reemplaza el contenido con el siguiente HTML:

---

## Template HTML

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invitación a Inflexo AI</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #0a0a0a;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #1a1a1a; border-radius: 16px; overflow: hidden; border: 1px solid #2a2a2a;">
          
          <!-- Header con gradiente -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                Inflexo AI
              </h1>
              <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px; font-weight: 400;">
                Automatización Inteligente
              </p>
            </td>
          </tr>
          
          <!-- Contenido principal -->
          <tr>
            <td style="padding: 50px 40px; background-color: #1a1a1a;">
              <h2 style="margin: 0 0 24px 0; color: #ffffff; font-size: 24px; font-weight: 600; line-height: 1.3;">
                Has sido invitado a Inflexo AI
              </h2>
              
              <p style="margin: 0 0 20px 0; color: #d4d4d4; font-size: 16px; line-height: 1.6;">
                Hola,
              </p>
              
              <p style="margin: 0 0 20px 0; color: #d4d4d4; font-size: 16px; line-height: 1.6;">
                Has sido invitado a unirte a <strong style="color: #ffffff;">Inflexo AI</strong> como administrador{{ if .Data.company_name }} de <strong style="color: #ffffff;">{{ .Data.company_name }}</strong>{{ end }}.
              </p>
              
              {{ if .Data.company_name }}
              <div style="margin: 0 0 20px 0; padding: 16px; background-color: #0a0a0a; border-radius: 8px; border: 1px solid #2a2a2a;">
                <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
                  Organización
                </p>
                <p style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 600;">
                  {{ .Data.company_name }}
                </p>
              </div>
              {{ end }}
              
              <p style="margin: 0 0 30px 0; color: #d4d4d4; font-size: 16px; line-height: 1.6;">
                Para completar tu registro y acceder a tu dashboard, haz clic en el botón de abajo:
              </p>
              
              <!-- Botón CTA -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 30px 0;">
                <tr>
                  <td align="center" style="padding: 0;">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; letter-spacing: 0.3px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                      Completar Registro
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Información adicional -->
              <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #2a2a2a;">
                <p style="margin: 0 0 12px 0; color: #9ca3af; font-size: 14px; line-height: 1.5;">
                  <strong style="color: #d4d4d4;">¿Qué es Inflexo AI?</strong>
                </p>
                <p style="margin: 0 0 20px 0; color: #9ca3af; font-size: 14px; line-height: 1.5;">
                  Diseñamos, desarrollamos e implementamos herramientas de automatización que se convierten en tu punto de inflexión.
                </p>
                
                <p style="margin: 0; color: #6b7280; font-size: 12px; line-height: 1.5;">
                  Este enlace expira en 7 días.<br>
                  Si no solicitaste esta invitación, puedes ignorar este email de forma segura.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #0a0a0a; text-align: center; border-top: 1px solid #2a2a2a;">
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px;">
                © 2025 Inflexo AI - Todos los derechos reservados
              </p>
              <p style="margin: 0; color: #4b5563; font-size: 11px;">
                Automatización Inteligente
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## Variables Disponibles

Supabase proporciona automáticamente estas variables en el template:

- `{{ .ConfirmationURL }}` - URL de confirmación/registro (incluye el token)
- `{{ .SiteURL }}` - URL base de tu aplicación
- `{{ .Data.company_name }}` - Nombre de la empresa (desde metadata)
- `{{ .Data.plan }}` - Plan seleccionado (desde metadata)
- `{{ .Data.notes }}` - Notas internas (desde metadata)

---

## Notas de Diseño

- **Colores**: Fondo oscuro (#0a0a0a, #1a1a1a) con gradientes violeta/púrpura
- **Tipografía**: Sistema sans-serif, legible y moderna
- **Espaciado**: Generoso para mejor legibilidad
- **Responsive**: Se adapta a diferentes tamaños de pantalla
- **Branding**: Consistente con la identidad visual de Inflexo AI

---

## Configuración Adicional

### Tiempo de Expiración

El tiempo de expiración del link se configura en:
- **Supabase Dashboard** → **Authentication** → **Settings** → **Email Auth**
- Busca "Email link expiry" (por defecto 24 horas, recomendado: 7 días)

### Redirección

La URL de redirección se configura en:
- **Supabase Dashboard** → **Authentication** → **URL Configuration**
- Agrega `http://localhost:3000/auth/register` para desarrollo
- Agrega tu dominio de producción para producción

---

## Testing

Para probar el template:

1. Configura el template en Supabase
2. Envía una invitación desde el dashboard admin
3. Verifica que el email llegue con el diseño correcto
4. Haz clic en el botón y verifica que redirija correctamente
