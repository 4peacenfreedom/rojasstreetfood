import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Star, Flame } from 'lucide-react';
import { menuCategories, menuItems, categoriesWithExtras } from '../data/menuData';
import { useCart } from '../context/CartContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import ExtrasModal from './ExtrasModal';
import ClosedModal from './ClosedModal';
import { useRestaurantStatus } from '../utils/restaurantHours';

function Menu() {
  const [activeCategory, setActiveCategory] = useState('hamburguesas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosedModalOpen, setIsClosedModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useCart();
  const headerRef = useScrollAnimation();
  const gridRef = useRef(null);
  const { isOpen: isRestaurantOpen, closedMessage } = useRestaurantStatus();

  const filteredItems = menuItems.filter(item => item.category === activeCategory);

  // Animate menu cards when they come into view or when category changes
  useEffect(() => {
    if (!gridRef.current) return;

    const cards = gridRef.current.querySelectorAll('.menu-card');

    // Reset animations
    cards.forEach(card => card.classList.remove('is-visible'));

    // Trigger stagger animation
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('is-visible');
            }, index * 40);
          });
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(gridRef.current);

    return () => observer.disconnect();
  }, [activeCategory]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CR').format(price);
  };

  // Handle add to cart - check if open, then show modal if category has extras
  const handleAddToCart = (item) => {
    // Check if restaurant is closed
    if (!isRestaurantOpen) {
      setIsClosedModalOpen(true);
      return;
    }

    if (categoriesWithExtras.includes(item.category)) {
      setSelectedProduct(item);
      setIsModalOpen(true);
    } else {
      addToCart(item);
    }
  };

  // Handle adding product with extras from modal
  const handleAddWithExtras = (product, extras) => {
    addToCart({ ...product, extras });
  };

  return (
    <section
      id="menu"
      className="py-16 md:py-24 relative menu-bg"
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-12 animate-on-scroll">
          <div className="inline-block mb-4">
            <span className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
              NUESTRO MENÚ
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl text-white mb-4">
            ¡AL CHILE QUE RICO!
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Descubrí nuestra variedad de hamburguesas, parrilladas y street food con el mejor sabor costarricense
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-10 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex flex-wrap justify-center" style={{ gap: '0.5rem' }}>
            {menuCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 md:px-6 md:py-3 rounded-full font-medium text-sm md:text-base whitespace-nowrap transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-[#1A1A1A] text-gray-300 hover:bg-[#242424] hover:text-white'
                }`}
                style={{ margin: '0.25rem' }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="menu-card bg-[#1A1A1A] rounded-2xl overflow-hidden card-hover group"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Popular badge */}
                {item.popular && (
                  <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center" style={{ gap: '0.25rem' }}>
                    <Flame className="w-3 h-3" />
                    <span>Popular</span>
                  </div>
                )}

                {/* Price tag */}
                <div className="absolute bottom-3 right-3 bg-white text-black px-3 py-1 rounded-lg font-bold">
                  ₡{formatPrice(item.price)}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-white font-bold text-lg mb-2 line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-4 min-h-[4.5rem]">
                  {item.description}
                </p>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(item)}
                  className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center transition-all duration-300 ${
                    isRestaurantOpen
                      ? 'bg-red-600 hover:bg-red-700 text-white group-hover:shadow-lg'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                  style={{ gap: '0.5rem' }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{isRestaurantOpen ? 'Agregar' : 'Cerrado'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No hay productos en esta categoría</p>
          </div>
        )}

        {/* View Full Menu PDF Button */}
        <div className="text-center mt-12">
          <a
            href="/menu.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors"
            style={{ gap: '0.5rem' }}
          >
            <span>Ver Menú Completo PDF</span>
          </a>
        </div>
      </div>

      {/* Extras Modal */}
      <ExtrasModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onAddToCart={handleAddWithExtras}
      />

      {/* Closed Modal */}
      <ClosedModal
        isOpen={isClosedModalOpen}
        onClose={() => setIsClosedModalOpen(false)}
        closedMessage={closedMessage}
      />
    </section>
  );
}

export default Menu;
