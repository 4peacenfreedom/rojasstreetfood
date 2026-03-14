import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, CheckCircle, Download, ChevronLeft } from 'lucide-react';

const INITIAL = { nombre: '', email: '', telefono: '' };

export default function Registro() {
  const [form, setForm]       = useState(INITIAL);
  const [status, setStatus]   = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');
  const [result, setResult]   = useState(null);   // { customer, qrDataUrl }

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/register-customer', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Ocurrió un error. Intentá de nuevo.');
        return;
      }

      setResult(data);
      setStatus('success');
    } catch {
      setStatus('error');
      setMessage('Error de conexión. Verificá tu internet e intentá de nuevo.');
    }
  }

  function downloadQR() {
    if (!result?.qrDataUrl) return;
    const a = document.createElement('a');
    a.href     = result.qrDataUrl;
    a.download = 'mi-qr-rojas-street-food.png';
    a.click();
  }

  if (status === 'success' && result) {
    return <SuccessView result={result} onDownload={downloadQR} />;
  }

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center px-4 py-20">
      {/* Back link */}
      <div className="w-full max-w-md mb-6">
        <Link to="/" className="inline-flex items-center gap-1 text-gray-400 hover:text-white transition-colors text-sm">
          <ChevronLeft className="w-4 h-4" />
          Volver al inicio
        </Link>
      </div>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '2px' }}>
            Programa de Fidelidad
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Registrate, recibí tu QR y empezá a acumular badges.<br />
            <span className="text-red-400 font-medium">₡5.000+ por visita = 1 badge · 10 badges = ₡6.000</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-[#1A1A1A] rounded-2xl p-6 shadow-xl border border-gray-800">
          <div className="space-y-4">
            <FormField
              label="Nombre completo"
              name="nombre"
              type="text"
              placeholder="Juan Pérez"
              value={form.nombre}
              onChange={handleChange}
              required
            />
            <FormField
              label="Correo electrónico"
              name="email"
              type="email"
              placeholder="juan@ejemplo.com"
              value={form.email}
              onChange={handleChange}
              required
            />
            <FormField
              label="Teléfono"
              name="telefono"
              type="tel"
              placeholder="8888-8888"
              value={form.telefono}
              onChange={handleChange}
              required
            />
          </div>

          {status === 'error' && (
            <div className="mt-4 bg-red-900/30 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full mt-6 btn-primary disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Registrando...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Registrarme gratis
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-500 mt-4">
            ¿Ya estás registrado?{' '}
            <Link to="/mis-puntos" className="text-red-400 hover:text-red-300 underline">
              Consultá tus puntos
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function FormField({ label, name, type, placeholder, value, onChange, required }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1.5">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-[#242424] border border-gray-700 rounded-lg px-4 py-3
                   text-white placeholder-gray-500 text-sm
                   focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500
                   transition-colors"
      />
    </div>
  );
}

function SuccessView({ result, onDownload }) {
  const { customer, qrDataUrl } = result;

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center px-4 py-20">
      <div className="w-full max-w-md text-center animate-slide-up">

        {/* Checkmark */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-6">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '2px' }}>
          ¡Listo, {customer.nombre.split(' ')[0]}!
        </h2>
        <p className="text-gray-400 mb-8 text-sm leading-relaxed">
          Te enviamos tu QR al correo <span className="text-white">{customer.email}</span>.<br />
          También podés descargarlo ahora mismo.
        </p>

        {/* QR */}
        {qrDataUrl && (
          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-gray-800 mb-6">
            <p className="text-sm text-gray-400 mb-4">Tu QR personal de fidelidad</p>
            <div className="flex justify-center mb-4">
              <img
                src={qrDataUrl}
                alt="Tu QR de fidelidad"
                className="w-52 h-52 rounded-xl border-4 border-red-600 p-1 bg-white"
              />
            </div>
            <button
              onClick={onDownload}
              className="inline-flex items-center gap-2 bg-[#242424] hover:bg-[#2f2f2f] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors border border-gray-700"
            >
              <Download className="w-4 h-4" />
              Descargar QR
            </button>
          </div>
        )}

        {/* How it works */}
        <div className="bg-[#1A1A1A] rounded-2xl p-5 border border-gray-800 text-left mb-6">
          <h3 className="text-red-500 font-semibold text-sm mb-3">¿Cómo funciona?</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2"><span>🏅</span> Presentá tu QR en caja en cada visita</li>
            <li className="flex items-start gap-2"><span>🔥</span> Cada compra de ₡5.000+ = 1 badge</li>
            <li className="flex items-start gap-2"><span>🏆</span> Al llegar a 10 badges = ₡6.000 de recompensa</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <Link to="/mis-puntos" className="btn-primary text-center block">
            Ver mis puntos
          </Link>
          <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
            Volver al menú
          </Link>
        </div>
      </div>
    </div>
  );
}
