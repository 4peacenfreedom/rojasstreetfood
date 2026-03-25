import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { restaurantInfo } from '../data/menuData';

const faqs = [
  /* ── Programa de Fidelidad ─────────────────────────────────── */
  {
    category: '🏅 Programa de Fidelidad',
    items: [
      {
        q: '¿Cómo funciona el programa de fidelidad?',
        a: 'Es muy sencillo: por cada compra de ₡5.000 o más acumulás 1 sello. Al juntar 10 sellos te ganás ₡6.000 de recompensa para usar en cualquier pedido. Se te avisa por correo cuando llegás al premio.',
      },
      {
        q: '¿Cómo me registro al programa?',
        a: () => (
          <>
            Entrá a <Link to="/registro" className="text-red-400 hover:text-red-300 underline">rojasstreetfood.com/registro</Link>, llenás
            tu nombre, correo y teléfono, y te mandamos un QR personalizado al correo al instante. ¡Es gratis y tarda menos de un minuto!
          </>
        ),
      },
      {
        q: '¿Cómo presento el QR para acumular?',
        a: 'En cada visita al restaurante mostrás el QR al colaborador en caja (desde la pantalla de tu teléfono o impreso) y él registra la compra. Si hacés un pedido por llamada, también podés dar tu nombre o teléfono para que lo registren manualmente.',
      },
      {
        q: '¿Los sellos son transferibles a otra persona?',
        a: 'No. Los sellos son personales e intransferibles. Cada cliente tiene su propio QR y su propio historial de puntos. No se pueden combinar ni ceder los puntos de una cuenta a otra.',
      },
      {
        q: '¿Perdí mi QR, qué hago?',
        a: () => (
          <>
            Tranqui, tus puntos están guardados y no los perdés. Andá a <Link to="/registro" className="text-red-400 hover:text-red-300 underline">la página de registro</Link>, buscá
            el link <em>"¿Perdiste tu QR? Reenviar"</em> e ingresá tu correo o teléfono. Te reenviamos el QR al instante.
          </>
        ),
      },
      {
        q: '¿Puedo acumular más de una recompensa a la vez?',
        a: 'No. Una vez que llegás a los 10 sellos, el contador se pausa hasta que canjeés tu recompensa en el restaurante. Después del canje empezás un nuevo ciclo desde cero.',
      },
      {
        q: '¿La recompensa de ₡6.000 se puede usar en cualquier pedido?',
        a: 'Sí, podés usarla en cualquier pedido, ya sea que lo hagás en el local o por llamada. Solo avisale al colaborador que tenés una recompensa pendiente y se aplica directo.',
      },
      {
        q: '¿Los sellos tienen fecha de vencimiento?',
        a: 'Por el momento los sellos no vencen. Podemos actualizar esta política en el futuro, pero siempre avisaremos con tiempo a los clientes registrados.',
      },
      {
        q: '¿Cómo consulto cuántos sellos tengo?',
        a: () => (
          <>
            Podés revisar tus puntos en cualquier momento en{' '}
            <Link to="/mis-puntos" className="text-red-400 hover:text-red-300 underline">rojasstreetfood.com/mis-puntos</Link>{' '}
            ingresando tu nombre, correo o teléfono. No necesitás usuario ni contraseña.
          </>
        ),
      },
    ],
  },

  /* ── Promo Cumpleañeros ─────────────────────────────────────── */
  {
    category: '🎂 Promo Cumpleañeros',
    items: [
      {
        q: '¿En qué consiste la Promo Cumpleañeros?',
        a: 'Es nuestra forma de celebrar tu día especial. Durante todo el mes de tu cumpleaños, tenés ₡8.000 a tu favor para gastar en cualquier plato de nuestro menú. Solo necesitás venir acompañado de al menos 3 personas y presentar tu cédula de identidad.',
      },
      {
        q: '¿Cuántos acompañantes necesito?',
        a: 'Necesitás un mínimo de 3 acompañantes, y cada uno de ellos debe consumir mínimo ₡6.000. ¡Es una celebración como se debe!',
      },
      {
        q: '¿Los ₡8.000 aplican para cualquier plato del menú?',
        a: '¡Sí! Podés usar los ₡8.000 en cualquier plato de nuestro menú. Elegís lo que más se te antoje.',
      },
      {
        q: '¿Cómo demuestro que es mi mes de cumpleaños?',
        a: 'Muy fácil, solo presentás tu cédula de identidad en caja. Con eso es suficiente para activar la promo.',
      },
      {
        q: '¿Puedo combinar la promo con el programa de fidelidad?',
        a: '¡Claro que sí! Si sos parte del programa de fidelidad, tu compra del día igual cuenta para acumular sellos. El cumpleaños y los puntos no se pelean. 🎉',
      },
      {
        q: '¿La promo aplica para pedidos por llamada o solo presencial?',
        a: 'La Promo Cumpleañeros aplica únicamente de forma presencial en el restaurante, ya que requiere presentar la cédula y venir acompañado. ¡Aprovechá para venir a celebrar con nosotros!',
      },
      {
        q: '¿Puedo usar la promo más de una vez en el mes?',
        a: 'La promo aplica una sola vez durante el mes de tu cumpleaños. ¡Pero ese único momento lo hacemos bien especial!',
      },
    ],
  },

  /* ── Ubicación y Contacto ───────────────────────────────────── */
  {
    category: '📍 Ubicación y Contacto',
    items: [
      {
        q: '¿Dónde están ubicados?',
        a: () => (
          <>
            Estamos en Desamparados, San José, Costa Rica.{' '}
            <a
              href={restaurantInfo.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300 underline"
            >
              Ver en Google Maps →
            </a>
          </>
        ),
      },
      {
        q: '¿Cuáles son los horarios de atención?',
        a: () => (
          <ul className="space-y-1">
            <li>📅 <strong className="text-white">Martes a Viernes:</strong> 4:00 pm – 10:00 pm</li>
            <li>📅 <strong className="text-white">Sábados:</strong> 3:00 pm – 10:00 pm</li>
            <li>📅 <strong className="text-white">Domingos:</strong> 3:00 pm – 9:30 pm</li>
            <li>🔴 <strong className="text-white">Lunes:</strong> Cerrado</li>
          </ul>
        ),
      },
      {
        q: '¿Cómo me comunico con ustedes?',
        a: () => (
          <>
            Podés llamarnos o escribirnos por WhatsApp al{' '}
            <a href={`https://wa.me/${restaurantInfo.whatsapp}`} target="_blank" rel="noopener noreferrer"
               className="text-red-400 hover:text-red-300 underline font-medium">
              {restaurantInfo.phone}
            </a>
            . También nos encontrás en Instagram y TikTok como{' '}
            <a href={`https://instagram.com/${restaurantInfo.instagram}`} target="_blank" rel="noopener noreferrer"
               className="text-red-400 hover:text-red-300 underline">
              @{restaurantInfo.instagram}
            </a>
            .
          </>
        ),
      },
    ],
  },

  /* ── Delivery ───────────────────────────────────────────────── */
  {
    category: '🛵 Delivery',
    items: [
      {
        q: '¿Tienen servicio de delivery?',
        a: () => (
          <>
            ¡Sí! Hacemos delivery en <strong className="text-white">Desamparados centro, San Rafael Abajo y San Miguel</strong> de Desamparados.
            Para hacer tu pedido a domicilio llamanos o escribinos al{' '}
            <a href={`https://wa.me/${restaurantInfo.whatsapp}`} target="_blank" rel="noopener noreferrer"
               className="text-red-400 hover:text-red-300 underline font-medium">
              {restaurantInfo.phone}
            </a>
            .
          </>
        ),
      },
      {
        q: '¿A qué zonas llegan con el delivery?',
        a: 'Por el momento cubrimos Desamparados centro, San Rafael Abajo y San Miguel de Desamparados. Si tenés dudas sobre si llegamos a tu zona, escribinos al 8621-3142 y te confirmamos.',
      },
      {
        q: '¿Cómo hago un pedido a domicilio?',
        a: () => (
          <>
            Llamanos o escribinos por WhatsApp al{' '}
            <a href={`https://wa.me/${restaurantInfo.whatsapp}`} target="_blank" rel="noopener noreferrer"
               className="text-red-400 hover:text-red-300 underline font-medium">
              {restaurantInfo.phone}
            </a>{' '}
            con tu pedido y dirección. Te confirmamos disponibilidad y tiempo de entrega.
          </>
        ),
      },
      {
        q: '¿Puedo acumular sellos si hago un pedido a domicilio?',
        a: 'Claro que sí. Cuando hacés tu pedido por llamada, solo decile al colaborador tu nombre o teléfono registrado y anotamos la compra para que sigan acumulando tus sellos.',
      },
    ],
  },
];

export default function FAQ() {
  // Nivel 1: qué categorías están expandidas (todas colapsadas por defecto)
  const [openCats, setOpenCats] = useState(new Set());
  // Nivel 2: qué pregunta individual está abierta
  const [openItem, setOpenItem] = useState(null);

  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); }),
      { threshold: 0.05 }
    );
    sectionRef.current.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function toggleCat(ci) {
    setOpenCats(prev => {
      const next = new Set(prev);
      if (next.has(ci)) {
        next.delete(ci);
        // Cerrar cualquier pregunta abierta de esta categoría
        setOpenItem(v => (v?.startsWith(`${ci}-`) ? null : v));
      } else {
        next.add(ci);
      }
      return next;
    });
  }

  function toggleItem(key) {
    setOpenItem(prev => (prev === key ? null : key));
  }

  return (
    <section ref={sectionRef} className="bg-[#121212] py-20 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12 animate-on-scroll">
          <span className="inline-block bg-red-600 text-white text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4">
            FAQ
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Todo lo que necesitás saber sobre el programa de fidelidad, promos, dónde encontrarnos y nuestro delivery.
          </p>
        </div>

        {/* Grid 2 cols x 2 rows — 1 col en mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((cat, ci) => {
            const isCatOpen = openCats.has(ci);

            return (
              <div
                key={ci}
                className="animate-on-scroll rounded-2xl border border-gray-800 overflow-hidden"
                style={{ transitionDelay: `${ci * 60}ms` }}
              >
                {/* ── Nivel 1: header de categoría ── */}
                <button
                  onClick={() => toggleCat(ci)}
                  className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors
                    ${isCatOpen ? 'bg-[#1F1F1F]' : 'bg-[#1A1A1A] hover:bg-[#1F1F1F]'}`}
                >
                  <span className="text-white font-semibold text-base">
                    {cat.category}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-red-500 shrink-0 transition-transform duration-300 ${isCatOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* ── Nivel 2: preguntas de la categoría ── */}
                <div className={`overflow-hidden transition-all duration-400 ${isCatOpen ? 'max-h-[2000px]' : 'max-h-0'}`}>
                  <div className="divide-y divide-gray-800 border-t border-gray-800">
                    {cat.items.map((item, ii) => {
                      const key    = `${ci}-${ii}`;
                      const isOpen = openItem === key;
                      const answer = typeof item.a === 'function' ? item.a() : item.a;

                      return (
                        <div key={ii} className="bg-[#161616]">
                          <button
                            onClick={() => toggleItem(key)}
                            className="w-full flex items-center justify-between px-5 py-3.5 text-left gap-4 hover:bg-[#1C1C1C] transition-colors"
                            aria-expanded={isOpen}
                          >
                            <span className="text-gray-300 text-sm font-medium leading-snug">
                              {item.q}
                            </span>
                            <ChevronDown
                              className={`w-4 h-4 text-red-500/70 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                            />
                          </button>

                          <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                            <div className="px-5 pb-4 text-gray-400 text-sm leading-relaxed">
                              {answer}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center animate-on-scroll">
          <p className="text-gray-500 text-sm mb-4">
            ¿Tenés alguna otra consulta?
          </p>
          <a
            href={`https://wa.me/${restaurantInfo.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp inline-flex"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Escribinos al {restaurantInfo.phone}
          </a>
        </div>

      </div>
    </section>
  );
}
