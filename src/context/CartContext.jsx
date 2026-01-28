import { createContext, useContext, useReducer, useEffect, useState } from 'react';

// Contexto del carrito
const CartContext = createContext();

// Acciones del reducer
const ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART',
};

// Reducer para manejar el estado del carrito
function cartReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_ITEM: {
      const existingItem = state.items.find(item => item.id === action.payload.id);

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }

    case ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };

    case ACTIONS.UPDATE_QUANTITY: {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== id),
        };
      }

      return {
        ...state,
        items: state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        ),
      };
    }

    case ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: [],
      };

    case ACTIONS.LOAD_CART:
      return {
        ...state,
        items: action.payload,
      };

    default:
      return state;
  }
}

// Proveedor del contexto
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [toast, setToast] = useState(null);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('rojas-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: ACTIONS.LOAD_CART, payload: parsedCart });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('rojas-cart', JSON.stringify(state.items));
  }, [state.items]);

  // Mostrar toast
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // Agregar item al carrito
  const addToCart = (item) => {
    dispatch({ type: ACTIONS.ADD_ITEM, payload: item });
    showToast(`${item.name} agregado al carrito`);
  };

  // Remover item del carrito
  const removeFromCart = (itemId) => {
    dispatch({ type: ACTIONS.REMOVE_ITEM, payload: itemId });
  };

  // Actualizar cantidad de un item
  const updateQuantity = (itemId, quantity) => {
    dispatch({ type: ACTIONS.UPDATE_QUANTITY, payload: { id: itemId, quantity } });
  };

  // Limpiar el carrito
  const clearCart = () => {
    dispatch({ type: ACTIONS.CLEAR_CART });
  };

  // Calcular totales
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Generar mensaje para WhatsApp
  const generateWhatsAppMessage = () => {
    if (state.items.length === 0) return '';

    let message = '¡Hola! Me gustaría hacer el siguiente pedido:\n\n';

    state.items.forEach((item, index) => {
      message += `${index + 1}. ${item.name} x${item.quantity} - ₡${(item.price * item.quantity).toLocaleString()}\n`;
    });

    message += `\n*Total: ₡${totalPrice.toLocaleString()}*\n\n`;
    message += '¡Gracias!';

    return encodeURIComponent(message);
  };

  const value = {
    items: state.items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    generateWhatsAppMessage,
    toast,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      {/* Toast notification */}
      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}
    </CartContext.Provider>
  );
}

// Hook personalizado para usar el carrito
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
}

export default CartContext;
