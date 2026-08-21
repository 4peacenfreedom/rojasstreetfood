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
  SET_ORDER_TYPE: 'SET_ORDER_TYPE',
  SET_TABLE_NUMBER: 'SET_TABLE_NUMBER',
};

// Generate a unique cart ID for items with extras
function generateCartId(item) {
  if (!item.extras || item.extras.length === 0) {
    return `item-${item.id}`;
  }
  const extrasKey = item.extras
    .map(e => `${e.id}-${e.quantity}`)
    .sort()
    .join('_');
  return `item-${item.id}-${extrasKey}`;
}

// Calculate total price for an item including extras
function calculateItemTotal(item) {
  let total = item.price;
  if (item.extras && item.extras.length > 0) {
    total += item.extras.reduce((sum, extra) => sum + (extra.price * extra.quantity), 0);
  }
  return total;
}

// Reducer para manejar el estado del carrito
function cartReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_ITEM: {
      const cartId = generateCartId(action.payload);
      const existingItem = state.items.find(item => item.cartId === cartId);

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.cartId === cartId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, cartId, quantity: 1 }],
      };
    }

    case ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.cartId !== action.payload),
      };

    case ACTIONS.UPDATE_QUANTITY: {
      const { cartId, quantity } = action.payload;

      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.cartId !== cartId),
        };
      }

      return {
        ...state,
        items: state.items.map(item =>
          item.cartId === cartId ? { ...item, quantity } : item
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

    case ACTIONS.SET_ORDER_TYPE:
      return {
        ...state,
        orderType: action.payload,
      };

    case ACTIONS.SET_TABLE_NUMBER:
      return {
        ...state,
        tableNumber: action.payload,
      };

    default:
      return state;
  }
}

// Proveedor del contexto
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    orderType: 'llevar', // 'mesa' o 'llevar'
    tableNumber: '',
  });
  const [toast, setToast] = useState(null);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('rojas-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: ACTIONS.LOAD_CART, payload: parsedCart.items || parsedCart });
        if (parsedCart.orderType) {
          dispatch({ type: ACTIONS.SET_ORDER_TYPE, payload: parsedCart.orderType });
        }
        if (parsedCart.tableNumber) {
          dispatch({ type: ACTIONS.SET_TABLE_NUMBER, payload: parsedCart.tableNumber });
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('rojas-cart', JSON.stringify({
      items: state.items,
      orderType: state.orderType,
      tableNumber: state.tableNumber,
    }));
  }, [state.items, state.orderType, state.tableNumber]);

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
  const removeFromCart = (cartId) => {
    dispatch({ type: ACTIONS.REMOVE_ITEM, payload: cartId });
  };

  // Actualizar cantidad de un item
  const updateQuantity = (cartId, quantity) => {
    dispatch({ type: ACTIONS.UPDATE_QUANTITY, payload: { cartId, quantity } });
  };

  // Limpiar el carrito
  const clearCart = () => {
    dispatch({ type: ACTIONS.CLEAR_CART });
  };

  // Establecer tipo de orden
  const setOrderType = (type) => {
    dispatch({ type: ACTIONS.SET_ORDER_TYPE, payload: type });
    // Limpiar número de mesa si cambia a llevar
    if (type === 'llevar') {
      dispatch({ type: ACTIONS.SET_TABLE_NUMBER, payload: '' });
    }
  };

  // Establecer número de mesa
  const setTableNumber = (number) => {
    dispatch({ type: ACTIONS.SET_TABLE_NUMBER, payload: number });
  };

  // Calcular totales
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.items.reduce((sum, item) => {
    const itemTotal = calculateItemTotal(item);
    return sum + (itemTotal * item.quantity);
  }, 0);

  // Generar mensaje para WhatsApp
  const generateWhatsAppMessage = () => {
    if (state.items.length === 0) return '';

    let message = '¡Hola! Me gustaría hacer el siguiente pedido:\n\n';

    // Agregar tipo de orden
    message += `📍 *${state.orderType === 'mesa' ? 'Para comer aquí' : 'Para llevar'}*\n`;
    if (state.orderType === 'mesa' && state.tableNumber) {
      message += `🪑 Mesa: *${state.tableNumber}*\n`;
    }
    message += '\n';

    state.items.forEach((item, index) => {
      const itemTotal = calculateItemTotal(item);
      message += `${index + 1}. ${item.name} x${item.quantity} - ₡${(itemTotal * item.quantity).toLocaleString()}\n`;

      // Add extras to the message
      if (item.extras && item.extras.length > 0) {
        item.extras.forEach(extra => {
          message += `   + ${extra.name} x${extra.quantity}\n`;
        });
      }
    });

    message += `\n*Total: ₡${totalPrice.toLocaleString()}*\n\n`;
    message += '¡Gracias!';

    return encodeURIComponent(message);
  };

  const value = {
    items: state.items,
    orderType: state.orderType,
    tableNumber: state.tableNumber,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setOrderType,
    setTableNumber,
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
