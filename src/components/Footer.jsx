import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Phone, Clock, MapPin } from 'lucide-react';
import { restaurantInfo } from '../data/menuData';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import ClosedModal from './ClosedModal';
import { useRestaurantStatus } from '../utils/restaurantHours';

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
  const gridRef = useRef(null);
  const [isClosedModalOpen, setIsClosedModalOpen] = useState(false);
  const { isOpen: isRestaurantOpen, closedMessage } = useRestaurantStatus();

  const handleWhatsAppClick = (e) => {
    if (!isRestaurantOpen) {
      e.preventDefault();
      setIsClosedModalOpen(true);
    }
  };

  useEffect(() => {
    if (!gridRef.current) return;

    const columns = gridRef.current.querySelectorAll('.footer-column');

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          columns.forEach((col, index) => {
            setTimeout(() => {
              col.classList.add('is-visible');
            }, index * 100);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <footer id="contacto" className="bg-[#0A0A0A] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="footer-column animate-on-scroll lg:col-span-1">
            <div className="mb-4">
              <img
                src="/logo_claro.svg"
                alt="Rojas Street Food and Grill"
                className="h-16 w-auto"
              />
            </div>
            <p className="text-red-500 font-display text-xl">
              {restaurantInfo.slogan}
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-column animate-on-scroll">
            <h4 className="text-white font-display text-2xl mb-4">Enlaces Rápidos</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
              <li className="pt-2 border-t border-gray-800">
                <Link to="/registro" className="text-red-500 hover:text-red-400 transition-colors font-medium">
                  🏅 Programa de Fidelidad
                </Link>
              </li>
              <li>
                <Link to="/mis-puntos" className="text-gray-400 hover:text-red-500 transition-colors">
                  Consultar mis puntos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-column animate-on-scroll">
            <h4 className="text-white font-display text-2xl mb-4">Contacto</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li className="flex items-center text-gray-400" style={{ gap: '0.75rem' }}>
                <Phone className={`w-5 h-5 ${isRestaurantOpen ? 'text-red-500' : 'text-gray-600'}`} />
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppClick}
                  className={`transition-colors ${
                    isRestaurantOpen
                      ? 'hover:text-red-500'
                      : 'text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {isRestaurantOpen ? restaurantInfo.phone : 'Cerrado'}
                </a>
              </li>
              <li className="flex items-center text-gray-400" style={{ gap: '0.75rem' }}>
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
              <li className="flex items-start text-gray-400" style={{ gap: '0.75rem' }}>
                <Clock className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p>{restaurantInfo.schedule.weekdays}</p>
                  <p>{restaurantInfo.schedule.saturday}</p>
                  <p>{restaurantInfo.schedule.sunday}</p>
                  <p className="text-red-500">{restaurantInfo.schedule.closed} cerrado</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="footer-column animate-on-scroll">
            <h4 className="text-white font-display text-2xl mb-4">Síguenos</h4>
            <div className="flex" style={{ gap: '1rem' }}>
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
                onClick={handleWhatsAppClick}
                className={`w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center transition-all duration-300 ${
                  isRestaurantOpen
                    ? 'text-gray-400 hover:bg-[#25D366] hover:text-white'
                    : 'text-gray-600 cursor-not-allowed'
                }`}
                aria-label="WhatsApp"
              >
                <Phone className="w-6 h-6" />
              </a>
            </div>

            {/* Social handles */}
            <div className="mt-4">
              <p className="text-gray-500 text-sm">
                @{restaurantInfo.instagram}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center" style={{ gap: '1rem' }}>
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {currentYear} {restaurantInfo.name}. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-3">
              <p className="text-gray-600 text-xs">
                Hecho con amor en Costa Rica
              </p>
              <Link
                to="/admin"
                className="text-gray-600 hover:text-gray-400 text-xs transition-colors"
                title="Panel administrativo"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Closed Modal */}
      <ClosedModal
        isOpen={isClosedModalOpen}
        onClose={() => setIsClosedModalOpen(false)}
        closedMessage={closedMessage}
      />
    </footer>
  );
}

export default Footer;
