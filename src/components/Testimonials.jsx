import { Star, Facebook } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { testimonials } from '../data/menuData';

import 'swiper/css';
import 'swiper/css/pagination';

function Testimonials() {
  return (
    <section id="testimonios" className="py-16 md:py-24 bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
              TESTIMONIOS
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl text-white mb-4">
            LO QUE DICEN NUESTROS CLIENTES
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            La satisfacción de nuestros clientes es nuestra mejor recompensa
          </p>
        </div>

        {/* Testimonials Carousel - Mobile */}
        <div className="md:hidden">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            spaceBetween={20}
            slidesPerView={1}
            className="pb-12"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <TestimonialCard testimonial={testimonial} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Testimonials Grid - Desktop */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        {/* Facebook Connect Button */}
        <div className="text-center mt-12">
          <button
            className="inline-flex items-center bg-[#1877F2] hover:bg-[#166FE5] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:shadow-lg"
            style={{ gap: '0.75rem' }}
            aria-label="Conectar con Facebook"
          >
            <Facebook className="w-6 h-6" />
            <span>Dejanos tu opinión en Facebook</span>
          </button>
        </div>
      </div>

      {/* Decorative circles */}
      <div className="relative">
        <div className="circle-decoration w-40 h-40 -top-20 -right-20 hidden lg:block" />
        <div className="circle-decoration w-32 h-32 -bottom-16 -left-16 hidden lg:block" />
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }) {
  return (
    <div className="bg-[#242424] rounded-2xl p-6 h-full card-hover">
      {/* Header with avatar and info */}
      <div className="flex items-center mb-4" style={{ gap: '1rem' }}>
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-14 h-14 rounded-full object-cover border-2 border-red-600"
          loading="lazy"
        />
        <div>
          <h4 className="text-white font-semibold">{testimonial.name}</h4>
          {/* Rating stars */}
          <div className="flex" style={{ gap: '0.25rem' }}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < testimonial.rating
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Comment */}
      <p className="text-gray-300 text-sm leading-relaxed">
        "{testimonial.comment}"
      </p>
    </div>
  );
}

export default Testimonials;
