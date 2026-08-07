'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type CartItem = {
  productSlug: string;
  variantId: string;
  variantTitle: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  count: number;
  subtotal: number;
  open: () => void;
  close: () => void;
  add: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  remove: (variantId: string) => void;
  setQuantity: (variantId: string, quantity: number) => void;
};

const STORAGE_KEY = 'jevtic.cart';

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      // A corrupt or unavailable store simply means we start with an empty cart.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore quota / private-mode errors */
    }
  }, [items]);

  // The drawer locks the page behind it while it is open.
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const add = useCallback((item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((i) => i.variantId === item.variantId);
      if (existing) {
        return current.map((i) =>
          i.variantId === item.variantId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...current, { ...item, quantity }];
    });
    setIsOpen(true);
  }, []);

  const remove = useCallback((variantId: string) => {
    setItems((current) => current.filter((i) => i.variantId !== variantId));
  }, []);

  const setQuantity = useCallback((variantId: string, quantity: number) => {
    setItems((current) =>
      quantity <= 0
        ? current.filter((i) => i.variantId !== variantId)
        : current.map((i) => (i.variantId === variantId ? { ...i, quantity } : i))
    );
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isOpen,
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add,
      remove,
      setQuantity,
    }),
    [items, isOpen, add, remove, setQuantity]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
