import { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { extras } from '../data/menuData';

function ExtrasModal({ isOpen, onClose, product, onAddToCart }) {
  const [selectedExtras, setSelectedExtras] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  // Get extras for this product's category
  const categoryExtras = extras[product?.category] || [];

  // Reset selected extras when modal opens with a new product
  useEffect(() => {
    if (isOpen) {
      setSelectedExtras({});
    }
  }, [isOpen, product?.id]);

  // Calculate total price
  useEffect(() => {
    if (!product) return;

    let extrasTotal = 0;
    Object.entries(selectedExtras).forEach(([extraId, quantity]) => {
      const extra = categoryExtras.find(e => e.id === extraId);
      if (extra) {
        extrasTotal += extra.price * quantity;
      }
    });

    setTotalPrice(product.price + extrasTotal);
  }, [selectedExtras, product, categoryExtras]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CR').format(price);
  };

  const handleAddExtra = (extraId) => {
    setSelectedExtras(prev => ({
      ...prev,
      [extraId]: (prev[extraId] || 0) + 1
    }));
  };

  const handleRemoveExtra = (extraId) => {
    setSelectedExtras(prev => {
      const newQuantity = (prev[extraId] || 0) - 1;
      if (newQuantity <= 0) {
        const { [extraId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [extraId]: newQuantity };
    });
  };

  const handleAddToCart = () => {
    // Build the extras array for the cart
    const extrasArray = Object.entries(selectedExtras)
      .filter(([_, quantity]) => quantity > 0)
      .map(([extraId, quantity]) => {
        const extra = categoryExtras.find(e => e.id === extraId);
        return {
          id: extraId,
          name: extra.name,
          price: extra.price,
          quantity
        };
      });

    onAddToCart(product, extrasArray);
    onClose();
  };

  const handleNoThanks = () => {
    onAddToCart(product, []);
    onClose();
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#1A1A1A] rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="relative p-4 border-b border-gray-700">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
          <h3 className="font-display text-2xl text-white pr-8">
            {product.name}
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            ¿Deseás agregar algún adicional?
          </p>
        </div>

        {/* Extras List */}
        <div className="p-4 max-h-[50vh] overflow-y-auto">
          <h4 className="text-red-500 font-semibold mb-3 text-sm uppercase tracking-wide">
            Adicionales Disponibles
          </h4>
          <div className="space-y-2">
            {categoryExtras.map((extra) => (
              <div
                key={extra.id}
                className="flex items-center justify-between bg-[#242424] rounded-lg p-3"
              >
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{extra.name}</p>
                  <p className="text-red-500 text-sm">₡{formatPrice(extra.price)}</p>
                </div>
                <div className="flex items-center" style={{ gap: '0.5rem' }}>
                  {selectedExtras[extra.id] > 0 && (
                    <>
                      <button
                        onClick={() => handleRemoveExtra(extra.id)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-full text-white transition-colors"
                        aria-label="Quitar"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-white font-semibold w-6 text-center">
                        {selectedExtras[extra.id]}
                      </span>
                    </>
                  )}
                  <button
                    onClick={() => handleAddExtra(extra.id)}
                    className="w-8 h-8 flex items-center justify-center bg-red-600 hover:bg-red-700 rounded-full text-white transition-colors"
                    aria-label="Agregar"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-[#121212]">
          {/* Total */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-400">Total:</span>
            <span className="text-white font-bold text-xl">₡{formatPrice(totalPrice)}</span>
          </div>

          {/* Buttons */}
          <div className="flex flex-col" style={{ gap: '0.75rem' }}>
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              style={{ gap: '0.5rem' }}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Agregar al Carrito</span>
            </button>
            <button
              onClick={handleNoThanks}
              className="w-full text-gray-400 hover:text-white font-medium py-2 transition-colors"
            >
              No Gracias, solo el producto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExtrasModal;
