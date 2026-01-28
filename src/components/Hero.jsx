import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { ChevronDown } from 'lucide-react';
import { heroSlides } from '../data/menuData';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

function Hero() {
  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="inicio" className="relative h-screen min-h-[600px]">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        loop={true}
        className="h-full w-full"
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />

              {/* Overlay */}
              <div className="hero-overlay absolute inset-0" />

              {/* Decorative circles */}
              <div className="circle-decoration w-32 h-32 top-20 right-10 hidden md:block" />
              <div className="circle-decoration w-24 h-24 bottom-32 left-10 hidden md:block" />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
                <div className="max-w-4xl mx-auto animate-slide-up">
                  {/* Logo badge */}
                  <div className="inline-block mb-6">
                    <div className="bg-red-600 px-4 py-2 rounded-lg transform -rotate-2">
                      <span className="font-display text-sm md:text-base text-white tracking-wider">
                        ROJAS STREET FOOD AND GRILL
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-white mb-4 leading-tight">
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
                    {slide.subtitle}
                  </p>

                  {/* CTA Button */}
                  <button
                    onClick={scrollToMenu}
                    className="btn-primary text-lg px-8 py-4 rounded-full inline-flex items-center space-x-2 animate-pulse-glow"
                  >
                    <span>{slide.cta}</span>
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <button
          onClick={scrollToMenu}
          className="text-white animate-bounce-subtle"
          aria-label="Scroll hacia abajo"
        >
          <ChevronDown className="w-10 h-10" />
        </button>
      </div>
    </section>
  );
}

export default Hero;
