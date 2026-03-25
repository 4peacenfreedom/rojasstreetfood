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

  const { query } = req.body ?? {};
  if (!query?.trim()) {
    return res.status(400).json({ error: 'Ingresá tu correo o teléfono' });
  }

  const q = query.trim();

  // Detectar si es email o teléfono
  const isEmail   = q.includes('@');
  const normalized = q.replace(/\D/g, '');

  let customer = null;

  if (isEmail) {
    const { data } = await supabaseAdmin
      .from('customers')
      .select('id, nombre, email, qr_code')
      .eq('email', q.toLowerCase())
      .maybeSingle();
    customer = data;
  } else {
    const { data } = await supabaseAdmin
      .from('customers')
      .select('id, nombre, email, qr_code')
      .eq('telefono', normalized)
      .maybeSingle();
    customer = data;
  }

  if (!customer) {
    return res.status(404).json({
      error: 'No encontramos ninguna cuenta con ese dato. ¿Ya te registraste?',
    });
  }

  // Regenerar QR desde la URL almacenada (o reconstruirla si está vacía)
  const appUrl  = process.env.APP_URL || 'https://rojasstreetfood.vercel.app';
  const qrUrl   = customer.qr_code || `${appUrl}/admin?scan=${customer.id}`;

  // Asegurar que qr_code esté guardado
  if (!customer.qr_code) {
    await supabaseAdmin
      .from('customers')
      .update({ qr_code: qrUrl })
      .eq('id', customer.id);
  }

  let qrDataUrl;
  try {
    qrDataUrl = await QRCode.toDataURL(qrUrl, {
      width: 300,
      margin: 2,
      color: { dark: '#000000', light: '#FFFFFF' },
      errorCorrectionLevel: 'M',
    });
  } catch (err) {
    console.error('[resend-qr] QR generation error:', err);
    return res.status(500).json({ error: 'Error generando el código QR' });
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const qrBase64  = qrDataUrl.split(',')[1];

  try {
    await resend.emails.send({
      from:    fromEmail,
      to:      customer.email,
      subject: '📱 Tu QR de fidelidad — Rojas Street Food',
      html:    buildResendEmail(customer.nombre, `${appUrl}/mis-puntos`),
      attachments: [
        { filename: 'mi-qr-rojas.png', content: qrBase64 },
      ],
    });
  } catch (err) {
    console.error('[resend-qr] email error:', err);
    return res.status(500).json({ error: 'No se pudo enviar el correo. Intentá de nuevo.' });
  }

  return res.status(200).json({ success: true, email: customer.email });
}

function buildResendEmail(nombre, misPuntosUrl) {
  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#121212;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#121212;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;background:#1A1A1A;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background:#DC2626;padding:28px 32px;text-align:center;">
              <h1 style="margin:0;color:#fff;font-size:24px;">📱 Tu QR de Fidelidad</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Rojas Street Food</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="color:#D1D5DB;margin:0 0 20px;font-size:15px;line-height:1.6;">
                ¡Hola, <strong style="color:#fff;">${nombre}</strong>! Aquí está tu QR adjunto.
                Tus puntos siguen intactos, no perdés nada. 🙌
              </p>
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#242424;border-radius:12px;border:2px solid #DC2626;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 8px;color:#fff;font-size:14px;font-weight:600;">
                      📎 Tu QR está adjunto en este correo
                    </p>
                    <p style="margin:0;color:#9CA3AF;font-size:13px;line-height:1.6;">
                      Guardalo en tu teléfono o imprimilo y presentalo en caja
                      en tu próxima visita para seguir acumulando sellos.
                    </p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${misPuntosUrl}"
                       style="display:inline-block;background:#DC2626;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
                      Ver mis puntos actuales
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:#111;padding:16px 32px;text-align:center;border-top:1px solid #333;">
              <p style="margin:0;color:#6B7280;font-size:13px;">
                ¿Dudas? Llamanos al <strong style="color:#9CA3AF;">8621-3142</strong>
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
