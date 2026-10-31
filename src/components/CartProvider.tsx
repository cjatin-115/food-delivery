"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  id: number;
  name: string;
  price: number; // paise
  emoji: string;
  isVeg: boolean;
  qty: number;
};

export type CartRestaurant = {
  id: number;
  name: string;
  slug: string;
  emoji: string;
  deliveryMinutes: number;
  priceForTwo: number;
};

export type CartState = {
  restaurant: CartRestaurant;
  items: CartItem[];
} | null;

import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "@/lib/constants";

const STORAGE_KEY = "tastytrail-cart-v1";

type CartContextValue = {
  cart: CartState;
  items: CartItem[];
  restaurant: CartRestaurant | null;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  addItem: (restaurant: CartRestaurant, item: Omit<CartItem, "qty">) => void;
  setQty: (id: number, qty: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  toast: { id: number; message: string } | null;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart(): CartState {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CartState;
    if (!parsed || !parsed.restaurant || !Array.isArray(parsed.items)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>(null);
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const toastId = useRef(0);
  const hydrated = useRef(false);

  // Hydrate from localStorage after mount (avoids SSR mismatch).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCart(readStoredCart());
    hydrated.current = true;
  }, []);

  // Persist whenever the cart changes (after hydration).
  useEffect(() => {
    if (!hydrated.current) return;
    if (cart && cart.items.length > 0) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [cart]);

  const showToast = useCallback((message: string) => {
    toastId.current += 1;
    setToast({ id: toastId.current, message });
  }, []);

  // Auto-dismiss the toast.
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const addItem = useCallback<CartContextValue["addItem"]>(
    (restaurant, item) => {
      setCart((prev) => {
        if (!prev || prev.restaurant.id !== restaurant.id) {
          // Starting (or switching) a cart: one restaurant at a time, like the big apps.
          return { restaurant, items: [{ ...item, qty: 1 }] };
        }
        const existing = prev.items.find((i) => i.id === item.id);
        if (existing) {
          return {
            restaurant: prev.restaurant,
            items: prev.items.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i)),
          };
        }
        return { restaurant: prev.restaurant, items: [...prev.items, { ...item, qty: 1 }] };
      });
      showToast(`${item.emoji} ${item.name} added to cart`);
    },
    [showToast],
  );

  const setQty = useCallback((id: number, qty: number) => {
    setCart((prev) => {
      if (!prev) return prev;
      if (qty <= 0) {
        const items = prev.items.filter((i) => i.id !== id);
        return items.length ? { ...prev, items } : null;
      }
      return { ...prev, items: prev.items.map((i) => (i.id === id ? { ...i, qty } : i)) };
    });
  }, []);

  const removeItem = useCallback((id: number) => {
    setCart((prev) => {
      if (!prev) return prev;
      const items = prev.items.filter((i) => i.id !== id);
      return items.length ? { ...prev, items } : null;
    });
  }, []);

  const clearCart = useCallback(() => setCart(null), []);

  const value = useMemo<CartContextValue>(() => {
    const items = cart?.items ?? [];
    const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const fee = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : DELIVERY_FEE;
    return {
      cart,
      items,
      restaurant: cart?.restaurant ?? null,
      itemCount,
      subtotal,
      deliveryFee: fee,
      total: subtotal + fee,
      addItem,
      setQty,
      removeItem,
      clearCart,
      toast,
    };
  }, [cart, addItem, setQty, removeItem, clearCart, toast]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
