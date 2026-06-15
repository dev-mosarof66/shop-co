/**
 * Sample Order Model
 * Replace with your actual database implementation
 */

interface IOrder {
  id: string;
  userId: string;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  shippingAddress: IAddress;
  billingAddress: IAddress;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IOrderItem {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  discount?: number;
}

interface IAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export { IOrder, IOrderItem, IAddress, OrderStatus, PaymentStatus };
