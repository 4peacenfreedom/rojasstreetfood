/**
 * Muestra una cuadrícula de 10 badges.
 * Los badges llenados = count. Si recompensaActiva, pulsa en dorado.
 */
export default function BadgeGrid({ count = 0, recompensaActiva = false, size = 'md' }) {
  const sizes = {
    sm: 'w-7 h-7 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };
  const cls = sizes[size] ?? sizes.md;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 10 }, (_, i) => {
          const filled = i < count;
          return (
            <div
              key={i}
              title={filled ? `Badge ${i + 1}` : 'Por ganar'}
              className={`
                ${cls} rounded-full border-2 flex items-center justify-center
                transition-all duration-300
                ${filled
                  ? recompensaActiva
                    ? 'bg-yellow-500 border-yellow-400 animate-pulse shadow-lg shadow-yellow-500/30'
                    : 'bg-red-600 border-red-500 shadow-md shadow-red-600/20'
                  : 'bg-transparent border-gray-600'}
              `}
            >
              {filled && (
                <span className="select-none" style={{ lineHeight: 1 }}>
                  {recompensaActiva ? '⭐' : '🔥'}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Texto de progreso */}
      <p className="text-sm text-gray-400 text-center">
        {recompensaActiva ? (
          <span className="text-yellow-400 font-semibold">🏆 ¡Recompensa lista!</span>
        ) : (
          <>
            <span className="text-white font-semibold">{count}</span>
            <span className="text-gray-500">/10 badges</span>
            {count > 0 && (
              <span className="text-gray-500"> · te faltan {10 - count}</span>
            )}
          </>
        )}
      </p>
    </div>
  );
}
