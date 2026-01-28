import { Link } from 'react-router-dom';
import { Home, UtensilsCrossed } from 'lucide-react';

function NotFound() {
  return (
    <main className="min-h-screen bg-[#121212] flex items-center justify-center px-4">
      <div className="text-center max-w-lg mx-auto">
        {/* Fun illustration */}
        <div className="relative mb-8">
          {/* Plate circle */}
          <div className="w-48 h-48 md:w-64 md:h-64 bg-[#1A1A1A] rounded-full mx-auto flex items-center justify-center border-4 border-gray-800 relative">
            {/* Crossed utensils */}
            <UtensilsCrossed className="w-24 h-24 md:w-32 md:h-32 text-red-600" />

            {/* Decorative dots like food crumbs */}
            <div className="absolute top-8 left-12 w-3 h-3 bg-red-600 rounded-full opacity-50" />
            <div className="absolute top-16 right-10 w-2 h-2 bg-red-600 rounded-full opacity-30" />
            <div className="absolute bottom-12 left-8 w-2 h-2 bg-red-600 rounded-full opacity-40" />
            <div className="absolute bottom-8 right-12 w-3 h-3 bg-red-600 rounded-full opacity-50" />
          </div>

          {/* Decorative circles */}
          <div className="absolute -top-4 -right-4 w-8 h-8 border-2 border-red-600 rounded-full opacity-30" />
          <div className="absolute -bottom-2 -left-2 w-6 h-6 border-2 border-red-600 rounded-full opacity-30" />
        </div>

        {/* 404 Text */}
        <h1 className="font-display text-8xl md:text-9xl text-red-600 mb-4">
          404
        </h1>

        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          ¡Ups! Esta página se la comieron
        </h2>
        <p className="text-gray-400 text-lg mb-8">
          Parece que alguien tenía mucha hambre y se llevó esta página.
          Pero no te preocupes, ¡nuestro menú sigue intacto!
        </p>

        {/* CTA Button */}
        <Link
          to="/"
          className="btn-primary inline-flex items-center space-x-2 px-8 py-4 rounded-full text-lg"
        >
          <Home className="w-5 h-5" />
          <span>Volver al Inicio</span>
        </Link>

        {/* Fun tagline */}
        <p className="text-gray-600 mt-8 text-sm">
          ¡Al chile que rico está vara! Mejor volvé al menú
        </p>
      </div>
    </main>
  );
}

export default NotFound;
