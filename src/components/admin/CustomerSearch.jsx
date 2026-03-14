import { useState } from 'react';
import { Search, UserPlus, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import PurchaseForm from './PurchaseForm';

async function searchCustomers(query) {
  const q = query.trim();
  if (!q) return [];

  const isEmail = q.includes('@');
  const digitsOnly = q.replace(/\D/g, '');
  const isPhone = /^\d{7,12}$/.test(digitsOnly);

  let req;
  if (isEmail) {
    req = supabase
      .from('customers')
      .select('id, nombre, email, telefono, rewards(badges_count, recompensa_activa, total_acumulado)')
      .eq('email', q.toLowerCase())
      .limit(5);
  } else if (isPhone) {
    req = supabase
      .from('customers')
      .select('id, nombre, email, telefono, rewards(badges_count, recompensa_activa, total_acumulado)')
      .eq('telefono', digitsOnly)
      .limit(5);
  } else {
    req = supabase
      .from('customers')
      .select('id, nombre, email, telefono, rewards(badges_count, recompensa_activa, total_acumulado)')
      .ilike('nombre', `%${q}%`)
      .limit(8);
  }

  const { data, error } = await req;
  if (error) throw error;
  return data ?? [];
}

export default function CustomerSearch({ preloadCustomerId = null }) {
  const [query, setQuery]           = useState('');
  const [results, setResults]       = useState([]);
  const [searching, setSearching]   = useState(false);
  const [selected, setSelected]     = useState(null); // { customer, reward }
  const [showCreate, setShowCreate] = useState(false);
  const [searched, setSearched]     = useState(false);

  // New customer form
  const [newForm, setNewForm] = useState({ nombre: '', email: '', telefono: '' });
  const [creating, setCreating]     = useState(false);
  const [createError, setCreateError] = useState('');

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setSearched(false);
    setResults([]);
    setSelected(null);
    try {
      const data = await searchCustomers(query);
      setResults(data);
      setSearched(true);
    } catch (err) {
      console.error('[CustomerSearch] error:', err);
    } finally {
      setSearching(false);
    }
  }

  function selectCustomer(customer) {
    const reward = Array.isArray(customer.rewards) ? customer.rewards[0] : customer.rewards;
    setSelected({ customer, reward });
    setResults([]);
    setQuery('');
    setSearched(false);
  }

  function clearSelected() {
    setSelected(null);
  }

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    setCreateError('');

    try {
      const res  = await fetch('/api/register-customer', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(newForm),
      });
      const data = await res.json();

      if (!res.ok) {
        setCreateError(data.error || 'Error al crear cliente');
        setCreating(false);
        return;
      }

      // Fetch full customer with rewards
      const { data: customer } = await supabase
        .from('customers')
        .select('id, nombre, email, telefono, rewards(badges_count, recompensa_activa, total_acumulado)')
        .eq('id', data.customer.id)
        .single();

      selectCustomer(customer);
      setShowCreate(false);
      setNewForm({ nombre: '', email: '', telefono: '' });
    } catch {
      setCreateError('Error de conexión');
    } finally {
      setCreating(false);
    }
  }

  // If a customer is selected, show PurchaseForm
  if (selected) {
    return (
      <PurchaseForm
        customer={selected.customer}
        reward={selected.reward}
        onClear={clearSelected}
        onDone={async () => {
          // Refresh reward data
          const { data } = await supabase
            .from('customers')
            .select('id, nombre, email, telefono, rewards(badges_count, recompensa_activa, total_acumulado)')
            .eq('id', selected.customer.id)
            .single();
          if (data) selectCustomer(data);
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar por nombre, correo o teléfono..."
          className="flex-1 bg-[#242424] border border-gray-700 rounded-lg px-4 py-3
                     text-white placeholder-gray-500 text-sm
                     focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500
                     transition-colors"
        />
        <button
          type="submit"
          disabled={searching || !query.trim()}
          className="btn-primary px-4 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {searching
            ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <Search className="w-4 h-4" />}
          <span className="hidden sm:inline">Buscar</span>
        </button>
      </form>

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-[#1A1A1A] rounded-xl border border-gray-800 overflow-hidden">
          {results.map(c => {
            const r = Array.isArray(c.rewards) ? c.rewards[0] : c.rewards;
            return (
              <button
                key={c.id}
                onClick={() => selectCustomer(c)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#242424] transition-colors border-b border-gray-800 last:border-0 text-left"
              >
                <div>
                  <p className="text-white text-sm font-medium">{c.nombre}</p>
                  <p className="text-gray-400 text-xs">{c.email} · {c.telefono}</p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    r?.recompensa_activa
                      ? 'bg-yellow-900/50 text-yellow-300'
                      : 'bg-gray-800 text-gray-400'
                  }`}>
                    {r?.recompensa_activa ? '🏆 Recompensa' : `${r?.badges_count ?? 0}/10 🔥`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {searched && results.length === 0 && (
        <div className="text-center py-4 text-gray-400 text-sm">
          No se encontró ningún cliente.
        </div>
      )}

      {/* Divider + Create */}
      <div className="flex items-center gap-3 pt-2">
        <div className="flex-1 h-px bg-gray-800" />
        <span className="text-gray-600 text-xs">o</span>
        <div className="flex-1 h-px bg-gray-800" />
      </div>

      <button
        onClick={() => setShowCreate(v => !v)}
        className="w-full flex items-center justify-center gap-2 border border-gray-700 text-gray-300
                   hover:border-red-600 hover:text-white rounded-xl py-3 text-sm font-medium transition-colors"
      >
        {showCreate ? <X className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
        {showCreate ? 'Cancelar' : 'Crear nuevo cliente'}
      </button>

      {/* Create form */}
      {showCreate && (
        <form onSubmit={handleCreate} className="bg-[#1A1A1A] rounded-xl border border-gray-800 p-4 space-y-3">
          <h4 className="text-white text-sm font-semibold">Nuevo cliente</h4>
          {[
            { label: 'Nombre completo', name: 'nombre', type: 'text',  placeholder: 'Juan Pérez' },
            { label: 'Correo',          name: 'email',   type: 'email', placeholder: 'juan@email.com' },
            { label: 'Teléfono',        name: 'telefono', type: 'tel', placeholder: '8888-8888' },
          ].map(f => (
            <div key={f.name}>
              <label className="block text-xs text-gray-400 mb-1">{f.label}</label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                value={newForm[f.name]}
                onChange={e => setNewForm(v => ({ ...v, [f.name]: e.target.value }))}
                required
                className="w-full bg-[#242424] border border-gray-700 rounded-lg px-3 py-2.5
                           text-white placeholder-gray-500 text-sm
                           focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
          ))}

          {createError && (
            <p className="text-red-400 text-xs">{createError}</p>
          )}

          <button
            type="submit"
            disabled={creating}
            className="w-full btn-primary text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {creating
              ? <><span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creando...</>
              : 'Crear y registrar compra'}
          </button>
        </form>
      )}
    </div>
  );
}
