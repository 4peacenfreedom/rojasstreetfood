import { Clock, MapPin, Phone } from 'lucide-react';
import { restaurantInfo } from '../data/menuData';

function QuickInfo() {
  const whatsappUrl = `https://wa.me/${restaurantInfo.whatsapp}`;

  return (
    <section className="bg-[#1A1A1A] py-8 border-y border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Horario */}
          <div className="flex items-center justify-center md:justify-start space-x-4 p-4 rounded-lg bg-[#242424] hover:bg-[#2a2a2a] transition-colors">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Horario</h3>
              <p className="text-gray-400 text-sm">{restaurantInfo.schedule.weekdays}</p>
              <p className="text-gray-300">{restaurantInfo.schedule.hours}</p>
            </div>
          </div>

          {/* Dirección */}
          <div className="flex items-center justify-center md:justify-start space-x-4 p-4 rounded-lg bg-[#242424] hover:bg-[#2a2a2a] transition-colors">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Ubicación</h3>
              <a
                href={restaurantInfo.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-red-500 transition-colors underline"
              >
                Ver en Google Maps
              </a>
              <p className="text-gray-400 text-sm">{restaurantInfo.address}</p>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="flex items-center justify-center md:justify-start space-x-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp w-full md:w-auto justify-center py-4 text-lg"
            >
              <Phone className="w-6 h-6" />
              <span>{restaurantInfo.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default QuickInfo;
