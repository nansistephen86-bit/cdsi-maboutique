import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/data/products";

const STORAGE_KEY = "cdsi_cart_v2";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  color: string | null;
  size: string | null;
  optionKey: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, options?: { color?: string | null; size?: string | null }) => void;
  removeItem: (id: string, optionKey: string) => void;
  increaseQuantity: (id: string, optionKey: string) => void;
  decreaseQuantity: (id: string, optionKey: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  hydrated: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // private mode / quota — keep going without persistence
    }
  }, [items, hydrated]);

  const addItem = useCallback(
    (
      product: Product,
      quantity = 1,
      options: { color?: string | null; size?: string | null } = {},
    ) => {
      const optionKey = `${options.color || ""}|${options.size || ""}`;
      setItems((prev) => {
        const existing = prev.find((i) => i.id === product.id && i.optionKey === optionKey);
        if (existing) {
          return prev.map((i) =>
            i.id === product.id && i.optionKey === optionKey
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          );
        }
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            color: options.color || null,
            size: options.size || null,
            optionKey,
            quantity,
          },
        ];
      });
    },
    [],
  );

  const removeItem = useCallback((id: string, optionKey: string) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.optionKey === optionKey)));
  }, []);

  const increaseQuantity = useCallback((id: string, optionKey: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id && i.optionKey === optionKey ? { ...i, quantity: i.quantity + 1 } : i,
      ),
    );
  }, []);

  const decreaseQuantity = useCallback((id: string, optionKey: string) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.id === id && i.optionKey === optionKey ? { ...i, quantity: i.quantity - 1 } : i,
        )
        .filter((i) => i.quantity > 0),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity * i.price, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      totalItems,
      subtotal,
      hydrated,
    }),
    [
      items,
      addItem,
      removeItem,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      totalItems,
      subtotal,
      hydrated,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé à l'intérieur de <CartProvider>");
  return ctx;
}
