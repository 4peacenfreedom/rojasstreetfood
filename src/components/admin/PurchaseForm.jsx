import { useState } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import BadgeGrid from '../loyalty/BadgeGrid';

const MIN_PURCHASE = 5000;

/**
 * Props:
 *  customer  { id, nombre, email, telefono }
 *  reward    { badges_count, recompensa_activa, total_acumulado }
 *  onDone()  callback after successful purchase
 *  onClear() callback to clear selected customer
 */
export default function PurchaseForm({ customer, reward, onDone, onClear }) {
  const [monto, setMonto]     = useState('');
  const [status, setStatus]   = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');
  const [newBadges, setNewBadges] = useState(null);

  const badges       = reward?.badges_count ?? 0;
  const activa       = reward?.recompensa_activa ?? false;
  const totalAcum    = reward?.total_acumulado ?? 0;
  const montoNum     = parseInt(monto.replace(/\D/g, ''), 10) || 0;
  const wouldGetBadge = montoNum >= MIN_PURCHASE && !activa;

  async function handleSubmit(e) {
    e.preventDefault();
    if (montoNum < MIN_PURCHASE) {
      setMessage(`El monto mínimo es ₡${MIN_PURCHASE.toLocaleString('es-CR')}`);
      setStatus('error');
      return;
    }

    if (activa) {
      setMessage('Este cliente tiene una recompensa activa pendiente de canjear.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      // 1. Registrar compra
      const { error: purchaseErr } = await supabase
        .from('purchases')
        .insert({ customer_id: customer.id, monto: montoNum, registrado_por: 'qr' });

      if (purchaseErr) throw purchaseErr;

      // 2. Actualizar badges
      const newCount     = badges + 1;
      const newActiva    = newCount >= 10;
      const newTotal     = totalAcum + montoNum;

      const { error: rewardErr } = await supabase
        .from('rewards')
        .update({
          badges_count:      newCount,
          total_acumulado:   newTotal,
          recompensa_activa: newActiva,
          updated_at:        new Date().toISOString(),
        })
        .eq('customer_id', customer.id);

      if (rewardErr) throw rewardErr;

      // 3. Si llegó a 10, enviar emails de recompensa
      if (newActiva) {
        const { data: { session } } = await supabase.auth.getSession();
        await fetch('/api/send-reward-email', {
          method:  'POST',
          headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${session?.access_token ?? ''}`,
          },
          body: JSON.stringify({ customerId: customer.id }),
        });
      }

      setNewBadges({ count: newCount, activa: newActiva });
      setStatus('success');
    } catch (err) {
      console.error('[PurchaseForm] error:', err);
      setMessage('Error al registrar la compra. Intentá de nuevo.');
      setStatus('error');
    }
  }

  function handleDone() {
    setMonto('');
    setStatus('idle');
    setMessage('');
    setNewBadges(null);
    if (onDone) onDone();
  }

  if (status === 'success' && newBadges) {
    return (
      <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-gray-800 animate-slide-up">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">¡Compra registrada!</h3>
          <p className="text-gray-400 text-sm mb-6">
            {customer.nombre} · ₡{montoNum.toLocaleString('es-CR')}
          </p>

          <BadgeGrid
            count={newBadges.count}
            recompensaActiva={newBadges.activa}
            size="md"
          />

          {newBadges.activa && (
            <div className="mt-4 bg-yellow-900/30 border border-yellow-600 rounded-xl p-4 text-center">
              <p className="text-yellow-300 font-semibold text-sm">
                🏆 ¡Llegó a 10 badges! Se enviaron los emails de recompensa.
              </p>
            </div>
          )}

          <button onClick={handleDone} className="mt-6 btn-primary w-full">
            Registrar otra compra
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] rounded-2xl border border-gray-800">
      {/* Customer header */}
      <div className="flex items-start justify-between p-5 border-b border-gray-800">
        <div>
          <h3 className="text-white font-semibold text-base">{customer.nombre}</h3>
          <p className="text-gray-400 text-sm">{customer.email}</p>
          <p className="text-gray-500 text-xs">{customer.telefono}</p>
        </div>
        {onClear && (
          <button onClick={onClear} className="text-gray-500 hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Badges current */}
      <div className="p-5 border-b border-gray-800">
        <BadgeGrid count={badges} recompensaActiva={activa} size="sm" />
      </div>

      {/* Active reward warning */}
      {activa ? (
        <div className="p-5">
          <div className="bg-yellow-900/30 border border-yellow-600 rounded-xl p-4 text-center">
            <p className="text-yellow-300 font-semibold text-sm">
              🏆 Este cliente tiene una recompensa de ₡6.000 pendiente de canjear.
            </p>
            <p className="text-yellow-400/70 text-xs mt-1">
              No se pueden agregar más badges hasta que la canjee.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Monto de la compra (₡)
            </label>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              value={monto}
              onChange={e => setMonto(e.target.value)}
              placeholder="5000"
              required
              className="w-full bg-[#242424] border border-gray-700 rounded-lg px-4 py-3
                         text-white placeholder-gray-500 text-sm
                         focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500
                         transition-colors"
            />
            {montoNum > 0 && (
              <p className={`text-xs mt-1 ${wouldGetBadge ? 'text-green-400' : 'text-gray-500'}`}>
                {wouldGetBadge
                  ? `✓ Califica para badge (${badges + 1}/10)`
                  : `Mínimo ₡${MIN_PURCHASE.toLocaleString('es-CR')} para obtener badge`}
              </p>
            )}
          </div>

          {status === 'error' && (
            <div className="flex items-center gap-2 bg-red-900/30 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading' || !monto}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Registrando...
              </>
            ) : (
              'Confirmar compra'
            )}
          </button>
        </form>
      )}
    </div>
  );
}
