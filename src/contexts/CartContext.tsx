import { createContext, useReducer, ReactNode, useEffect } from 'react';

// Define product type
  // SKU属性接口
  export interface SkuAttribute {
    name: string;
    values: string[];
  }
  
  // SKU项接口
  export interface SkuItem {
    id: string;
    attributes: Record<string, string>; // 属性组合，如 {color: "红色", size: "XL"}
    price: number;
    stock: number;
  }
  
  export interface Product {
    id: number;
    name: string;
    price: number;
    memberPrice: number;
    mainImages: string[]; // 主图，最多6张
    detailImages: string[]; // 详情图，最多20张
    description: string;
    category: string;
    rating: number;
    stock: number; // 总库存，当有SKU时为所有SKU库存总和
    isActive: boolean; // 产品是否上架
    quantity?: number;
    skuAttributes?: SkuAttribute[]; // SKU属性定义
    skus?: SkuItem[]; // SKU列表
    image?: string; // 兼容旧数据
   }

// Define cart item type (extends Product with quantity)
export interface CartItem extends Product {
  quantity: number;
}

// Define cart context type
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

// Define cart context with default values
export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0
});

// Cart reducer for state management
type CartAction = 
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'INITIALIZE_CART'; payload: CartItem[] };

interface CartState {
  cartItems: CartItem[];
}

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.cartItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // If item exists, update quantity
        const updatedCartItems = [...state.cartItems];
        updatedCartItems[existingItemIndex].quantity += quantity;
        
        // Ensure quantity doesn't exceed stock
        if (updatedCartItems[existingItemIndex].quantity > product.stock) {
          updatedCartItems[existingItemIndex].quantity = product.stock;
        }
        
        return { cartItems: updatedCartItems };
      } else {
        // If item doesn't exist, add new item
        return {
          cartItems: [...state.cartItems, { ...product, quantity }]
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      return {
        cartItems: state.cartItems.filter(item => item.id !== action.payload.productId)
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      
      // Ensure quantity is at least 1
      if (quantity < 1) return state;
      
      return {
        cartItems: state.cartItems.map(item => 
          item.id === productId ? { ...item, quantity } : item
        )
      };
    }
    
    case 'CLEAR_CART':
      return { cartItems: [] };
      
    case 'INITIALIZE_CART':
      return { cartItems: action.payload };
      
    default:
      return state;
  }
};

// Cart provider component
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [state, dispatch] = useReducer(cartReducer, { cartItems: [] });
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'INITIALIZE_CART', payload: parsedCart });
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(state.cartItems));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [state.cartItems]);
  
  // Calculate totals
  const totalItems = state.cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = state.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Cart operations
  const addToCart = (product: Product, quantity: number) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  };
  
  const removeFromCart = (productId: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  };
  
  const updateQuantity = (productId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };
  
  // 只在支付完成后调用此方法
  // 只在支付完成后调用此方法
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  // Context value
  const contextValue: CartContextType = {
    cartItems: state.cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice
  };
  
  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};