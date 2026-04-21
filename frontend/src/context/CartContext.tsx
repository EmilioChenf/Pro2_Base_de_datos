import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { CartItem, ClientProduct } from '@/types';

const STORAGE_KEY = 'plushstore_cart';

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: ClientProduct, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addToCart(product, quantity = 1) {
        setItems((current) => {
          const existing = current.find((item) => item.product.id === product.id);

          if (existing) {
            return current.map((item) =>
              item.product.id === product.id
                ? {
                    ...item,
                    quantity: Math.min(item.quantity + quantity, product.stock),
                  }
                : item,
            );
          }

          return [...current, { product, quantity: Math.min(quantity, product.stock) }];
        });
      },
      removeFromCart(productId) {
        setItems((current) =>
          current.filter((item) => Number(item.product.id) !== productId),
        );
      },
      updateQuantity(productId, quantity) {
        if (quantity <= 0) {
          setItems((current) =>
            current.filter((item) => Number(item.product.id) !== productId),
          );
          return;
        }

        setItems((current) =>
          current.map((item) =>
            Number(item.product.id) === productId
              ? {
                  ...item,
                  quantity: Math.min(quantity, item.product.stock),
                }
              : item,
          ),
        );
      },
      clearCart() {
        setItems([]);
      },
      getTotalItems() {
        return items.reduce((total, item) => total + item.quantity, 0);
      },
      getTotalPrice() {
        return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },
    }),
    [items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }

  return context;
}
