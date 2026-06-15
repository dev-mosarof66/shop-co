import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type CartItem } from '@/lib/cart';

export type OrderStatus = 'processing' | 'shipped' | 'delivered';

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  date: string;
  status: OrderStatus;
  shippingAddress: string;
}

interface OrdersContextValue {
  orders: Order[];
  addOrder: (order: Omit<Order, 'status'>) => void;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);
const STORAGE_KEY = 'shopco_orders';

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as Order[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const addOrder = (order: Omit<Order, 'status'>) => {
    setOrders(prev => [{ ...order, status: 'processing' }, ...prev]);
  };

  return (
    <OrdersContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider');
  return ctx;
}
