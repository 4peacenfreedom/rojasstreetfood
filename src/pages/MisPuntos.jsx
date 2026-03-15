import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import BadgeGrid from '../components/loyalty/BadgeGrid';

function normalizePhone(str) {
  return str.replace(/[\s\-()]/g, '');
}

function detectSearchType(query) {
  const q = query.trim();
  if (q.includes('@')) return 'email';
  const digits = normalizePhone(q);
  if (/^\d{7,12}$/.test(digits)) return 'phone';
  return 'name';
}

async function findCustomer(query) {
  const q    = query.trim();
  const type = detectSearchType(q);

  // Usamos .limit(1) + primer elemento del array en vez de .maybeSingle(),
  // así no falla si hay duplicados temporales en la base de datos.
  let result;

  if (type === 'email') {
    result = await supabase
      .from('customers')
      .select('id, nombre, rewards(badges_count, recompensa_activa)')
      .eq('email', q.toLowerCase())
      .limit(1);

  } else if (type === 'phone') {
    const digits = normalizePhone(q);
    // Busca dígitos puros (nuevo formato) O con guiones (datos anteriores al fix)
    result = await supabase
      .from('customers')
      .select('id, nombre, rewards(badges_count, recompensa_activa)')
      .or(`telefono.eq.${digits},telefono.eq.${q.trim()}`)
      .limit(1);

  } else {
    result = await supabase
      .from('customers')
      .select('id, nombre, rewards(badges_count, recompensa_activa)')
      .ilike('nombre', `%${q}%`)
      .limit(1);
  }

  if (result.error) throw result.error;
  return result.data?.[0] ?? null;
}

function buildMessage(customer) {
  if (!customer) return null;

  const reward  = Array.isArray(customer.rewards) ? customer.rewards[0] : customer.rewards;
  const badges  = reward?.badges_count ?? 0;
  const activa  = reward?.recompensa_activa ?? false;

  if (activa) {
    return {
      type: 'reward',
      nombre: customer.nombre,
      badges,
      text: '¡Al chile que lo lograste! Tenés tu recompensa de ₡6.000 lista para canjear. Presentate en el restaurante o llamanos al 8621-3142 para usarla.',
    };
  }

  if (badges === 0) {
    return {
      type: 'zero',
      nombre: customer.nombre,
      badges,
      text: 'Aún no tenés badges acumulados. ¡Cada compra de ₡5.000 o más te da un badge. Vení a comer y empezá a acumular!',
    };
  }

  return {
    type: 'progress',
    nombre: customer.nombre,
    badges,
    text: `¡Upe! Tenés ${badges} badge${badges !== 1 ? 's' : ''} acumulado${badges !== 1 ? 's' : ''}. Te faltan solo ${10 - badges} para ganarte ₡6.000 de recompensa. ¡Seguí viniendo!`,
  };
}

export default function MisPuntos() {
  const [query, setQuery]     = useState('');
  const [status, setStatus]   = useState('idle'); // idle | loading | found | notfound | error
  const [msgData, setMsgData] = useState(null);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;

    setStatus('loading');
    setMsgData(null);

    try {
      const customer = await findCustomer(query);

      if (!customer) {
        setStatus('notfound');
        return;
      }

      setMsgData(buildMessage(customer));
      setStatus('found');
    } catch (err) {
      console.error('[MisPuntos] search error:', err);
      setStatus('error');
    }
  }

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center px-4 py-20">
      {/* Back link */}
      <div className="w-full max-w-lg mb-6">
        <Link to="/" className="inline-flex items-center gap-1 text-gray-400 hover:text-white transition-colors text-sm">
          <ChevronLeft className="w-4 h-4" />
          Volver al inicio
        </Link>
      </div>

      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
            <span className="text-2xl">🏅</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '2px' }}>
            Mis Puntos
          </h1>
          <p className="text-gray-400 text-sm">
            Consultá tus badges acumulados ingresando tu nombre, correo o teléfono.
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="bg-[#1A1A1A] rounded-2xl p-6 shadow-xl border border-gray-800 mb-6">
          <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-2">
            Nombre, correo electrónico o teléfono
          </label>
          <div className="flex gap-2">
            <input
              id="search"
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Ej: Juan Pérez  /  juan@email.com  /  8888-8888"
              className="flex-1 bg-[#242424] border border-gray-700 rounded-lg px-4 py-3
                         text-white placeholder-gray-500 text-sm
                         focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500
                         transition-colors"
            />
            <button
              type="submit"
              disabled={status === 'loading' || !query.trim()}
              className="btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
            >
              {status === 'loading' ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Buscar</span>
            </button>
          </div>
        </form>

        {/* Results */}
        {status === 'found' && msgData && (
          <ResultCard data={msgData} />
        )}

        {status === 'notfound' && (
          <NotFoundCard />
        )}

        {status === 'error' && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-xl p-5 text-sm text-center">
            Error de conexión. Intentá de nuevo en un momento.
          </div>
        )}

        {/* Register CTA */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            ¿Aún no estás registrado?{' '}
            <Link to="/registro" className="text-red-400 hover:text-red-300 underline">
              Registrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function ResultCard({ data }) {
  const colorMap = {
    reward:   'border-yellow-500 bg-yellow-900/10',
    progress: 'border-red-700 bg-red-900/10',
    zero:     'border-gray-700 bg-gray-800/20',
  };
  const iconMap = {
    reward:   '🏆',
    progress: '🔥',
    zero:     '🏁',
  };

  return (
    <div className={`rounded-2xl border p-6 animate-slide-up ${colorMap[data.type]}`}>
      <div className="text-center mb-4">
        <span className="text-3xl">{iconMap[data.type]}</span>
        <h3 className="text-lg font-semibold text-white mt-1">{data.nombre}</h3>
      </div>

      <BadgeGrid
        count={data.badges}
        recompensaActiva={data.type === 'reward'}
        size="md"
      />

      <p className="mt-4 text-sm text-gray-300 text-center leading-relaxed">
        {data.text}
      </p>

      {data.type === 'reward' && (
        <a
          href="tel:+50686213142"
          className="mt-4 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-xl transition-colors text-sm"
        >
          📞 Llamanos: 8621-3142
        </a>
      )}
    </div>
  );
}

function NotFoundCard() {
  return (
    <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6 text-center animate-slide-up">
      <span className="text-4xl block mb-3">🤔</span>
      <p className="text-gray-300 text-sm leading-relaxed mb-4">
        Hmmm, no encontramos esa información. ¿Ya te registraste en nuestro programa?
        Si no, llenás el formulario, recibís tu QR y empezás a acumular badges desde
        tu próxima visita. ¡Te esperamos!
      </p>
      <Link to="/registro" className="btn-primary inline-block text-sm">
        Registrarme gratis
      </Link>
    </div>
  );
}
