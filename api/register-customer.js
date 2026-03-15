import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import QRCode from 'qrcode';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { nombre, email, telefono } = req.body ?? {};

  if (!nombre?.trim() || !email?.trim() || !telefono?.trim()) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  // Normalizar teléfono: solo dígitos
  const telefonoNorm = telefono.replace(/\D/g, '');

  // Verificar duplicados por email O teléfono
  const { data: existingEmail } = await supabaseAdmin
    .from('customers')
    .select('id')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle();

  if (existingEmail) {
    return res.status(409).json({
      error: 'Este correo ya está registrado en el programa.',
      canResend: true,
    });
  }

  const { data: existingPhone } = await supabaseAdmin
    .from('customers')
    .select('id')
    .eq('telefono', telefonoNorm)
    .maybeSingle();

  if (existingPhone) {
    return res.status(409).json({
      error: 'Este teléfono ya está registrado en el programa.',
      canResend: true,
    });
  }

  // Insertar cliente
  const { data: customer, error: insertError } = await supabaseAdmin
    .from('customers')
    .insert({
      nombre: nombre.trim(),
      email: email.toLowerCase().trim(),
      telefono: telefonoNorm,
    })
    .select()
    .single();

  if (insertError) {
    console.error('[register-customer] insert error:', insertError);
    return res.status(500).json({ error: 'Error al registrar el cliente' });
  }

  // Generar URL del QR (se abre en el admin con el cliente pre-cargado)
  const appUrl = process.env.APP_URL || 'https://rojasstreetfood.vercel.app';
  const qrUrl  = `${appUrl}/admin?scan=${customer.id}`;

  // Generar imagen QR como PNG base64
  let qrDataUrl;
  try {
    qrDataUrl = await QRCode.toDataURL(qrUrl, {
      width: 300,
      margin: 2,
      color: { dark: '#000000', light: '#FFFFFF' },
      errorCorrectionLevel: 'M',
    });
  } catch (err) {
    console.error('[register-customer] QR generation error:', err);
    return res.status(500).json({ error: 'Error generando el código QR' });
  }

  // Guardar URL del QR en el cliente
  await supabaseAdmin
    .from('customers')
    .update({ qr_code: qrUrl })
    .eq('id', customer.id);

  // Crear registro de rewards (badges en 0)
  await supabaseAdmin
    .from('rewards')
    .insert({ customer_id: customer.id, badges_count: 0, total_acumulado: 0 });

  // Enviar email de bienvenida con QR adjunto
  const qrBase64 = qrDataUrl.split(',')[1];
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  try {
    await resend.emails.send({
      from: fromEmail,
      to: customer.email,
      subject: '🔥 ¡Bienvenido al programa de fidelidad de Rojas Street Food!',
      html: buildWelcomeEmail(customer.nombre, `${appUrl}/mis-puntos`),
      attachments: [
        {
          filename: 'mi-qr-rojas.png',
          content: qrBase64,
        },
      ],
    });
  } catch (emailErr) {
    // No fallar el registro si el email falla — el QR se devuelve igual
    console.error('[register-customer] email error:', emailErr);
  }

  return res.status(200).json({
    success: true,
    customer: {
      id:       customer.id,
      nombre:   customer.nombre,
      email:    customer.email,
      telefono: customer.telefono,
    },
    qrDataUrl,
  });
}

function buildWelcomeEmail(nombre, misPuntosUrl) {
  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#121212;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#121212;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;background:#1A1A1A;border-radius:16px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:#DC2626;padding:28px 32px;text-align:center;">
              <h1 style="margin:0;color:#fff;font-size:26px;letter-spacing:1px;">
                🔥 ROJAS STREET FOOD
              </h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">
                Programa de Fidelidad
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <h2 style="margin:0 0 8px;color:#fff;font-size:22px;">
                ¡Upe, ${nombre}! 👋
              </h2>
              <p style="color:#9CA3AF;margin:0 0 24px;line-height:1.6;">
                Ya sos parte del programa de fidelidad. ¡A acumular badges y ganarte tu recompensa!
              </p>

              <!-- Cómo funciona -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#242424;border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <h3 style="margin:0 0 12px;color:#DC2626;font-size:16px;">¿Cómo funciona?</h3>
                    <p style="margin:0 0 8px;color:#D1D5DB;font-size:14px;line-height:1.7;">
                      🏅 Cada compra de <strong style="color:#fff;">₡5.000 o más</strong> = <strong style="color:#DC2626;">1 badge</strong>
                    </p>
                    <p style="margin:0 0 8px;color:#D1D5DB;font-size:14px;line-height:1.7;">
                      🏆 Al juntar <strong style="color:#fff;">10 badges</strong> = <strong style="color:#DC2626;">₡6.000 de recompensa</strong>
                    </p>
                    <p style="margin:0;color:#D1D5DB;font-size:14px;line-height:1.7;">
                      📱 Presentá tu QR adjunto en caja en cada visita
                    </p>
                  </td>
                </tr>
              </table>

              <!-- QR note -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#242424;border-radius:12px;border:2px solid #DC2626;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;text-align:center;">
                    <p style="margin:0 0 12px;color:#fff;font-size:15px;font-weight:600;">
                      Tu QR personal está adjunto 📎
                    </p>
                    <p style="margin:0;color:#9CA3AF;font-size:13px;line-height:1.6;">
                      Guardalo en tu teléfono o imprimilo.<br/>
                      Presentalo en caja en cada visita para acumular badges.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <a href="${misPuntosUrl}"
                       style="display:inline-block;background:#DC2626;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
                      Ver mis puntos
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#111;padding:20px 32px;text-align:center;border-top:1px solid #333;">
              <p style="margin:0 0 4px;color:#6B7280;font-size:13px;">
                ¿Dudas? Llamanos al <strong style="color:#9CA3AF;">8621-3142</strong>
              </p>
              <p style="margin:0;color:#6B7280;font-size:13px;">
                Rojas Street Food and Grill · Costa Rica
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
