<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invitación a Inflexo AI</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #000000;">
  <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; background-color: #000000;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="max-width: 560px; width: 100%; border-collapse: collapse; background-color: #0a0a0a; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08);">
          <tr>
            <td style="padding: 40px 40px 28px; background-color: #000000; border-bottom: 1px solid rgba(255,255,255,0.06);">
              <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="border-collapse: collapse;">
                <tr>
                  <td style="width: 40px; height: 40px; vertical-align: middle; padding-right: 12px;">
                    <div style="width: 40px; height: 40px; border-radius: 36px; background: linear-gradient(229deg, #df7afe 13%, rgba(201,110,240,0.4) 35%, rgba(164,92,219,0.3) 64%, #814ac8 88%);"></div>
                  </td>
                  <td style="vertical-align: middle;">
                    <span style="color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">Inflexo AI</span>
                  </td>
                </tr>
              </table>
              <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.5); font-size: 13px; text-align: center;">
                Automatización inteligente
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 36px; background-color: #0a0a0a;">
              <h2 style="margin: 0 0 20px 0; color: #ffffff; font-size: 22px; font-weight: 600; line-height: 1.3;">
                Te invitamos a Inflexo AI
              </h2>
              <p style="margin: 0 0 16px 0; color: #a1a1aa; font-size: 16px; line-height: 1.6;">
                Hola,
              </p>
              <p style="margin: 0 0 16px 0; color: #a1a1aa; font-size: 16px; line-height: 1.6;">
                Gracias por confiar en nosotros. Nos alegra invitarte a unirte a <strong style="color: #e4e4e7;">Inflexo AI</strong>{{ if .Data.company_name }} como administrador de <strong style="color: #e4e4e7;">{{ .Data.company_name }}</strong>{{ end }}.
              </p>
              {{ if .Data.company_name }}
              <div style="margin: 0 0 24px 0; padding: 16px; background-color: #000000; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);">
                <p style="margin: 0 0 6px 0; color: #71717a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                  Organización
                </p>
                <p style="margin: 0; color: #ffffff; font-size: 17px; font-weight: 600;">
                  {{ .Data.company_name }}
                </p>
              </div>
              {{ end }}
              <p style="margin: 0 0 28px 0; color: #a1a1aa; font-size: 16px; line-height: 1.6;">
                Cuando estés listo, hacé clic en el botón de abajo para crear tu cuenta y acceder a tu dashboard. Cualquier duda, respondé este mail.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 0 0 28px 0;">
                    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px; letter-spacing: 0.2px;">
                      Completar registro
                    </a>
                  </td>
                </tr>
              </table>
              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.06);">
                <p style="margin: 0 0 10px 0; color: #71717a; font-size: 14px; line-height: 1.5;">
                  <strong style="color: #a1a1aa;">Inflexo AI</strong> — Diseñamos e implementamos automatizaciones que se convierten en tu punto de inflexión.
                </p>
                <p style="margin: 0; color: #52525b; font-size: 12px; line-height: 1.5;">
                  Este enlace vence en 7 días. Si no esperabas esta invitación, podés ignorar este correo.
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 36px; background-color: #000000; text-align: center; border-top: 1px solid rgba(255,255,255,0.06);">
              <p style="margin: 0 0 4px 0; color: #52525b; font-size: 12px;">
                © 2025 Inflexo AI
              </p>
              <p style="margin: 0; color: #3f3f46; font-size: 11px;">
                Automatización inteligente
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
