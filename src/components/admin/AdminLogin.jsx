import { useState } from 'react';
import { Lock, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { signIn }    = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus]     = useState('idle'); // idle | loading | error
  const [error, setError]       = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      await signIn(email, password);
      // AuthContext onAuthStateChange actualiza la sesión automáticamente
    } catch (err) {
      setError('Credenciales incorrectas. Verificá tu email y contraseña.');
      setStatus('error');
    }
  }

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '2px' }}>
            Panel Administrativo
          </h1>
          <p className="text-gray-500 text-sm mt-1">Rojas Street Food</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-[#1A1A1A] rounded-2xl p-6 border border-gray-800 shadow-2xl">
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-gray-300 mb-1.5">
                Correo electrónico
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@ejemplo.com"
                required
                className="w-full bg-[#242424] border border-gray-700 rounded-lg px-4 py-3
                           text-white placeholder-gray-500 text-sm
                           focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500
                           transition-colors"
              />
            </div>
            <div>
              <label htmlFor="admin-pass" className="block text-sm font-medium text-gray-300 mb-1.5">
                Contraseña
              </label>
              <input
                id="admin-pass"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#242424] border border-gray-700 rounded-lg px-4 py-3
                           text-white placeholder-gray-500 text-sm
                           focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500
                           transition-colors"
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-900/30 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Ingresando...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Ingresar
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-4">
          Acceso exclusivo para personal de Rojas Street Food
        </p>
      </div>
    </div>
  );
}
