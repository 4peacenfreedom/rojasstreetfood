import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { restaurantInfo } from '../data/menuData';
import Footer from '../components/Footer';

function Cart() {
  const {
    items,
    totalItems,
    totalPrice,
    removeFromCart,
    updateQuantity,
    clearCart,
    generateWhatsAppMessage,
  } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CR').format(price);
  };

  const handleWhatsAppOrder = () => {
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${restaurantInfo.whatsapp}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <main className="min-h-screen bg-[#121212] pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver al menú</span>
            </Link>
            <h1 className="font-display text-4xl md:text-5xl text-white">
              Mi Carrito
            </h1>
            {totalItems > 0 && (
              <p className="text-gray-400 mt-2">
                {totalItems} {totalItems === 1 ? 'producto' : 'productos'} en tu carrito
              </p>
            )}
          </div>

          {items.length === 0 ? (
            // Empty Cart State
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-[#1A1A1A] rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-12 h-12 text-gray-600" />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Tu carrito está vacío
              </h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                ¡Explorá nuestro menú y agregá tus platillos favoritos para hacer tu pedido!
              </p>
              <Link
                to="/#menu"
                className="btn-primary inline-flex items-center space-x-2 px-8 py-4 rounded-full"
              >
                <span>Ver Menú</span>
              </Link>
            </div>
          ) : (
            // Cart with items
            <div className="space-y-6">
              {/* Cart Items */}
              <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex items-center p-4 md:p-6 ${
                      index !== items.length - 1 ? 'border-b border-gray-800' : ''
                    }`}
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 ml-4">
                      <h3 className="text-white font-semibold text-lg">
                        {item.name}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-1 hidden sm:block">
                        {item.description}
                      </p>
                      <p className="text-red-500 font-bold mt-1">
                        ₡{formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2 md:space-x-3 ml-4">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 md:w-10 md:h-10 bg-[#242424] hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors"
                        aria-label="Reducir cantidad"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-white font-semibold w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 md:w-10 md:h-10 bg-[#242424] hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Subtotal and Remove */}
                    <div className="ml-4 md:ml-6 text-right">
                      <p className="text-white font-bold">
                        ₡{formatPrice(item.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-500 hover:text-red-500 transition-colors mt-1"
                        aria-label="Eliminar producto"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="bg-[#1A1A1A] rounded-2xl p-6">
                <h3 className="text-white font-semibold text-lg mb-4">
                  Resumen del Pedido
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal ({totalItems} productos)</span>
                    <span>₡{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Envío</span>
                    <span className="text-green-500">Consultar</span>
                  </div>
                  <div className="border-t border-gray-800 pt-3 flex justify-between">
                    <span className="text-white font-semibold text-lg">Total</span>
                    <span className="text-white font-bold text-2xl">
                      ₡{formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleWhatsAppOrder}
                    className="btn-whatsapp w-full py-4 text-lg justify-center rounded-xl"
                  >
                    <Phone className="w-6 h-6" />
                    <span>Ordenar por WhatsApp</span>
                  </button>

                  <button
                    onClick={clearCart}
                    className="w-full py-3 text-gray-400 hover:text-red-500 transition-colors font-medium"
                  >
                    Vaciar carrito
                  </button>
                </div>
              </div>

              {/* Info Note */}
              <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-gray-800">
                <p className="text-gray-400 text-sm text-center">
                  Al presionar "Ordenar por WhatsApp" serás redirigido a WhatsApp con tu pedido listo.
                  Nuestro equipo te confirmará disponibilidad y tiempo de entrega.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Cart;
