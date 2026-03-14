import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Validar sesión de admin
  const authHeader = req.headers.authorization ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) {
    return res.status(401).json({ error: 'Sesión inválida' });
  }

  const { customerId } = req.body ?? {};
  if (!customerId) {
    return res.status(400).json({ error: 'customerId requerido' });
  }

  // Obtener datos del cliente
  const { data: customer, error: custError } = await supabaseAdmin
    .from('customers')
    .select('nombre, email')
    .eq('id', customerId)
    .single();

  if (custError || !customer) {
    return res.status(404).json({ error: 'Cliente no encontrado' });
  }

  // Verificar que realmente tiene la recompensa activa
  const { data: reward } = await supabaseAdmin
    .from('rewards')
    .select('recompensa_activa, badges_count')
    .eq('customer_id', customerId)
    .single();

  if (!reward?.recompensa_activa) {
    return res.status(400).json({ error: 'El cliente no tiene recompensa activa' });
  }

  const fromEmail  = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const ownerEmail = process.env.OWNER_EMAIL;
  const appUrl     = process.env.APP_URL || 'https://rojasstreetfood.vercel.app';

  const errors = [];

  // Email al cliente
  try {
    await resend.emails.send({
      from:    fromEmail,
      to:      customer.email,
      subject: '🏆 ¡Lograste tu recompensa en Rojas Street Food!',
      html:    buildCustomerRewardEmail(customer.nombre, appUrl),
    });
  } catch (err) {
    errors.push(`cliente: ${err.message}`);
    console.error('[send-reward-email] email to customer failed:', err);
  }

  // Email al dueño
  if (ownerEmail) {
    try {
      await resend.emails.send({
        from:    fromEmail,
        to:      ownerEmail,
        subject: `🏆 Recompensa lista: ${customer.nombre}`,
        html:    buildOwnerRewardEmail(customer.nombre, customer.email),
      });
    } catch (err) {
      errors.push(`dueño: ${err.message}`);
      console.error('[send-reward-email] email to owner failed:', err);
    }
  }

  return res.status(200).json({
    success: true,
    ...(errors.length > 0 && { warnings: errors }),
  });
}

function buildCustomerRewardEmail(nombre, appUrl) {
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
              <h1 style="margin:0;color:#fff;font-size:26px;">🏆 ¡LO LOGRASTE!</h1>
            </td>
          </tr>

          <tr>
            <td style="padding:32px;">
              <h2 style="margin:0 0 12px;color:#fff;font-size:22px;">
                ¡Al chile, ${nombre}! 🔥
              </h2>
              <p style="color:#9CA3AF;margin:0 0 24px;line-height:1.6;">
                Llegaste a tus <strong style="color:#DC2626;">10 badges</strong> y ya tenés tu recompensa lista.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#242424;border:2px solid #DC2626;border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:24px;text-align:center;">
                    <p style="margin:0 0 8px;font-size:36px;">🎁</p>
                    <p style="margin:0 0 4px;color:#fff;font-size:20px;font-weight:700;">
                      ₡6.000 de recompensa
                    </p>
                    <p style="margin:0;color:#9CA3AF;font-size:14px;">
                      Lista para canjear en tu próxima visita
                    </p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="background:#242424;border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <h3 style="margin:0 0 12px;color:#DC2626;font-size:15px;">¿Cómo canjearla?</h3>
                    <p style="margin:0 0 6px;color:#D1D5DB;font-size:14px;line-height:1.7;">
                      1. Vení al restaurante o hacé tu pedido por llamada
                    </p>
                    <p style="margin:0 0 6px;color:#D1D5DB;font-size:14px;line-height:1.7;">
                      2. Decile al empleado que tenés una recompensa pendiente
                    </p>
                    <p style="margin:0;color:#D1D5DB;font-size:14px;line-height:1.7;">
                      3. Se aplica el descuento de ₡6.000 en tu compra
                    </p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="tel:+50686213142"
                       style="display:inline-block;background:#25D366;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
                      📞 Llamanos: 8621-3142
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background:#111;padding:20px 32px;text-align:center;border-top:1px solid #333;">
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

function buildOwnerRewardEmail(nombre, email) {
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
            <td style="background:#DC2626;padding:24px 32px;text-align:center;">
              <h1 style="margin:0;color:#fff;font-size:22px;">🏆 Recompensa Lista para Canjear</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;">
              <p style="color:#D1D5DB;margin:0 0 20px;font-size:15px;line-height:1.6;">
                El cliente <strong style="color:#fff;">${nombre}</strong> (<em style="color:#9CA3AF;">${email}</em>)
                acumuló sus <strong style="color:#DC2626;">10 badges</strong> y tiene
                <strong style="color:#fff;">₡6.000 de recompensa</strong> lista para canjear.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#242424;border-radius:12px;">
                <tr>
                  <td style="padding:16px 24px;">
                    <p style="margin:0;color:#9CA3AF;font-size:14px;line-height:1.6;">
                      📌 Cuando el cliente llegue, marcá la recompensa como canjeada desde el
                      <strong style="color:#fff;">panel de administración</strong>.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:#111;padding:16px 32px;text-align:center;border-top:1px solid #333;">
              <p style="margin:0;color:#6B7280;font-size:12px;">
                Rojas Street Food — Panel Administrativo
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
