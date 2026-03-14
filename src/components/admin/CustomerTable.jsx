import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Trophy, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import BadgeGrid from '../loyalty/BadgeGrid';

export default function CustomerTable() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [expanded, setExpanded]   = useState(null); // customer id with expanded history
  const [redeeming, setRedeeming] = useState(null); // customer id being redeemed

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('customers')
      .select(`
        id, nombre, email, telefono, created_at,
        rewards (badges_count, total_acumulado, recompensa_activa, recompensa_canjeada, fecha_canje),
        purchases (id, monto, fecha, registrado_por)
      `)
      .order('created_at', { ascending: false });

    if (!error) setCustomers(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  async function handleRedeem(customerId) {
    if (!window.confirm('¿Confirmar canje de la recompensa de ₡6.000? Esto reiniciará el contador de badges a 0.')) return;

    setRedeeming(customerId);
    const { error } = await supabase
      .from('rewards')
      .update({
        recompensa_activa:   false,
        recompensa_canjeada: true,
        badges_count:        0,
        fecha_canje:         new Date().toISOString(),
        updated_at:          new Date().toISOString(),
      })
      .eq('customer_id', customerId);

    if (!error) await fetchCustomers();
    setRedeeming(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400">
        <span className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-3" />
        Cargando clientes...
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-400 text-sm">{customers.length} cliente{customers.length !== 1 ? 's' : ''} registrados</p>
        <button
          onClick={fetchCustomers}
          className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </button>
      </div>

      {customers.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-3">👥</p>
          <p>Aún no hay clientes registrados.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {customers.map(c => {
            const reward   = Array.isArray(c.rewards)   ? c.rewards[0]   : c.rewards;
            const purchases = Array.isArray(c.purchases) ? c.purchases    : [];
            const badges    = reward?.badges_count ?? 0;
            const activa    = reward?.recompensa_activa ?? false;
            const isExpanded = expanded === c.id;

            return (
              <div key={c.id} className="bg-[#1A1A1A] rounded-xl border border-gray-800 overflow-hidden">
                {/* Main row */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-white font-semibold text-sm truncate">{c.nombre}</h3>
                        {activa && (
                          <span className="inline-flex items-center gap-1 bg-yellow-900/40 border border-yellow-600 text-yellow-300 text-xs px-2 py-0.5 rounded-full shrink-0">
                            <Trophy className="w-3 h-3" />
                            Recompensa lista
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-xs mt-0.5 truncate">{c.email}</p>
                      <p className="text-gray-500 text-xs">{c.telefono}</p>
                    </div>

                    {/* Badges pill */}
                    <div className="shrink-0 text-right">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                        activa ? 'bg-yellow-900/40 text-yellow-300' : 'bg-gray-800 text-gray-300'
                      }`}>
                        {badges}/10 🔥
                      </span>
                      <p className="text-gray-600 text-xs mt-1">
                        ₡{(reward?.total_acumulado ?? 0).toLocaleString('es-CR')} total
                      </p>
                    </div>
                  </div>

                  {/* Badge grid (compact) */}
                  <div className="mt-3">
                    <BadgeGrid count={badges} recompensaActiva={activa} size="sm" />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {activa && (
                      <button
                        onClick={() => handleRedeem(c.id)}
                        disabled={redeeming === c.id}
                        className="flex items-center gap-1.5 bg-yellow-600 hover:bg-yellow-500 text-white
                                   text-xs font-semibold px-3 py-2 rounded-lg transition-colors
                                   disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {redeeming === c.id
                          ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          : <Trophy className="w-3 h-3" />}
                        Canjear ₡6.000
                      </button>
                    )}

                    {purchases.length > 0 && (
                      <button
                        onClick={() => setExpanded(v => v === c.id ? null : c.id)}
                        className="flex items-center gap-1 text-gray-400 hover:text-white text-xs transition-colors"
                      >
                        <Clock className="w-3 h-3" />
                        {purchases.length} compra{purchases.length !== 1 ? 's' : ''}
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Purchase history */}
                {isExpanded && (
                  <div className="border-t border-gray-800 bg-[#141414]">
                    <p className="text-xs text-gray-500 px-4 pt-3 pb-1">Historial de compras</p>
                    <div className="divide-y divide-gray-800">
                      {[...purchases]
                        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                        .map(p => (
                          <div key={p.id} className="flex items-center justify-between px-4 py-2.5">
                            <div>
                              <p className="text-white text-xs font-medium">
                                ₡{p.monto.toLocaleString('es-CR')}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {p.registrado_por === 'qr' ? '📱 QR' : '✏️ Manual'}
                              </p>
                            </div>
                            <p className="text-gray-500 text-xs">
                              {new Date(p.fecha).toLocaleDateString('es-CR', {
                                day: '2-digit', month: 'short', year: 'numeric',
                              })}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
