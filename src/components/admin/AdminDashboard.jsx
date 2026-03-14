import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Users, ShoppingBag, LogOut, QrCode } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import CustomerSearch from './CustomerSearch';
import CustomerTable from './CustomerTable';
import PurchaseForm from './PurchaseForm';

const TABS = [
  { id: 'registrar', label: 'Registrar compra', icon: ShoppingBag },
  { id: 'clientes',  label: 'Clientes',          icon: Users },
];

export default function AdminDashboard() {
  const { session, signOut }  = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab]         = useState('registrar');

  // QR scan: si la URL tiene ?scan=UUID, auto-cargar ese cliente
  const scanId = searchParams.get('scan');
  const [scannedCustomer, setScannedCustomer] = useState(null);
  const [scannedReward, setScannedReward]     = useState(null);
  const [loadingScan, setLoadingScan]         = useState(false);

  useEffect(() => {
    if (!scanId) return;

    async function loadScanned() {
      setLoadingScan(true);
      const { data } = await supabase
        .from('customers')
        .select('id, nombre, email, telefono, rewards(badges_count, recompensa_activa, total_acumulado)')
        .eq('id', scanId)
        .single();

      if (data) {
        setScannedCustomer(data);
        const reward = Array.isArray(data.rewards) ? data.rewards[0] : data.rewards;
        setScannedReward(reward);
        setTab('registrar');
      }
      setLoadingScan(false);
    }

    loadScanned();
  }, [scanId]);

  function clearScan() {
    setScannedCustomer(null);
    setScannedReward(null);
    // Limpiar el param de la URL
    setSearchParams({});
  }

  async function onPurchaseDone() {
    if (!scannedCustomer) return;
    // Recargar datos del cliente
    const { data } = await supabase
      .from('customers')
      .select('id, nombre, email, telefono, rewards(badges_count, recompensa_activa, total_acumulado)')
      .eq('id', scannedCustomer.id)
      .single();
    if (data) {
      setScannedCustomer(data);
      const reward = Array.isArray(data.rewards) ? data.rewards[0] : data.rewards;
      setScannedReward(reward);
    }
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Admin Navbar */}
      <header className="bg-[#1A1A1A] border-b border-gray-800 px-4 py-3 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo_claro.svg" alt="Rojas Street Food" className="h-9 w-auto" />
            <div className="h-5 w-px bg-gray-700" />
            <span className="text-gray-300 text-sm font-medium hidden sm:block">Panel Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-xs hidden sm:block truncate max-w-[140px]">
              {session?.user?.email}
            </span>
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 transition-colors text-sm"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-6">

        {/* QR scan banner */}
        {scanId && loadingScan && (
          <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-4 mb-4 flex items-center gap-3">
            <span className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin shrink-0" />
            <p className="text-gray-400 text-sm">Cargando cliente del QR...</p>
          </div>
        )}

        {scanId && !loadingScan && !scannedCustomer && (
          <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 mb-4 text-sm text-red-300">
            ⚠️ No se encontró el cliente asociado a este QR.
          </div>
        )}

        {/* QR scan info */}
        {!scanId && tab === 'registrar' && !scannedCustomer && (
          <div className="bg-[#1A1A1A] border border-dashed border-gray-700 rounded-xl p-4 mb-4 flex items-start gap-3">
            <QrCode className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-gray-300 text-sm font-medium">Escanear QR del cliente</p>
              <p className="text-gray-500 text-xs mt-0.5">
                Usá la cámara de tu teléfono para escanear el QR. Se abrirá esta página con el cliente pre-cargado.
                También podés buscar manualmente abajo.
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex bg-[#1A1A1A] rounded-xl p-1 mb-5 border border-gray-800">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors
                  ${tab === t.id
                    ? 'bg-red-600 text-white'
                    : 'text-gray-400 hover:text-white'}`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{t.label}</span>
                <span className="sm:hidden">{t.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {tab === 'registrar' && (
          <div>
            {scannedCustomer ? (
              <PurchaseForm
                customer={scannedCustomer}
                reward={scannedReward}
                onClear={clearScan}
                onDone={onPurchaseDone}
              />
            ) : (
              <CustomerSearch />
            )}
          </div>
        )}

        {tab === 'clientes' && <CustomerTable />}
      </main>
    </div>
  );
}
