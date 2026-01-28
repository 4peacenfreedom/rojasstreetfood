import { Instagram, Phone, Clock, MapPin } from 'lucide-react';
import { restaurantInfo } from '../data/menuData';

// TikTok icon component (Lucide doesn't have TikTok)
const TikTokIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

function Footer() {
  const currentYear = new Date().getFullYear();
  const whatsappUrl = `https://wa.me/${restaurantInfo.whatsapp}`;
  const instagramUrl = `https://instagram.com/${restaurantInfo.instagram}`;
  const tiktokUrl = `https://tiktok.com/@${restaurantInfo.tiktok}`;

  return (
    <footer id="contacto" className="bg-[#0A0A0A] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <div className="bg-white inline-block p-2 rounded">
                <span className="font-display text-2xl text-black font-bold tracking-wider">
                  ROJAS
                </span>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Street Food and Grill
            </p>
            <p className="text-red-500 font-display text-xl">
              {restaurantInfo.slogan}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a href="/#inicio" className="text-gray-400 hover:text-red-500 transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="/#menu" className="text-gray-400 hover:text-red-500 transition-colors">
                  Menú
                </a>
              </li>
              <li>
                <a href="/#testimonios" className="text-gray-400 hover:text-red-500 transition-colors">
                  Testimonios
                </a>
              </li>
              <li>
                <a href="/carrito" className="text-gray-400 hover:text-red-500 transition-colors">
                  Mi Carrito
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-5 h-5 text-red-500" />
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-500 transition-colors"
                >
                  {restaurantInfo.phone}
                </a>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-5 h-5 text-red-500" />
                <a
                  href={restaurantInfo.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-500 transition-colors"
                >
                  {restaurantInfo.address}
                </a>
              </li>
              <li className="flex items-start space-x-3 text-gray-400">
                <Clock className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p>{restaurantInfo.schedule.weekdays}</p>
                  <p>{restaurantInfo.schedule.hours}</p>
                  <p className="text-red-500">{restaurantInfo.schedule.closed} cerrado</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Síguenos</h4>
            <div className="flex space-x-4">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center text-gray-400 hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-500 hover:to-orange-400 hover:text-white transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all duration-300"
                aria-label="TikTok"
              >
                <TikTokIcon className="w-6 h-6" />
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center text-gray-400 hover:bg-[#25D366] hover:text-white transition-all duration-300"
                aria-label="WhatsApp"
              >
                <Phone className="w-6 h-6" />
              </a>
            </div>

            {/* Social handles */}
            <div className="mt-4 space-y-1">
              <p className="text-gray-500 text-sm">
                @{restaurantInfo.instagram}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {currentYear} {restaurantInfo.name}. Todos los derechos reservados.
            </p>
            <p className="text-gray-600 text-xs">
              Hecho con amor en Costa Rica
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
