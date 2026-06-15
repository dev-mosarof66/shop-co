const BASE = `${(import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:5000'}/api/v1/seller`;

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message ?? 'Request failed');
  return body;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LowStockItem {
  id: string;
  name: string;
  sku: string;
  stock: number;
  threshold: number;
}

export interface ChartDataPoint { date: string; value: number }

export interface SellerStats {
  revenue: { thisMonth: number; lastMonth: number };
  orders: { thisMonth: number };
  products: { total: number; lowStock: number; lowStockItems: LowStockItem[] };
  recentOrders: SellerOrderSummary[];
  topProducts: { id: string; name: string; revenue: number; unitsSold: number }[];
  revenueChart: ChartDataPoint[];
  userGrowth: ChartDataPoint[];
}

export interface SellerOrderSummary {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  itemCount: number;
}

export interface SellerProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number | null;
  stock: number;
  lowStockThreshold: number;
  isActive: boolean;
  isFeatured: boolean;
  badge: string | null;
  iconKey: string;
  sku: string;
  rating: number;
  reviewCount: number;
  category: { id: string; name: string; slug: string } | null;
  categoryId: string | null;
  features: string[];
  specs: Record<string, string>;
  createdAt: string;
}

export interface SellerProductInput {
  name: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  stock: number;
  lowStockThreshold?: number;
  sku: string;
  categoryId?: string | null;
  iconKey?: string;
  badge?: string | null;
  isFeatured?: boolean;
  isActive?: boolean;
  features?: string[];
  specs?: Record<string, string>;
}

export interface SellerOrder {
  id: string;
  status: string;
  paymentStatus: string;
  total: number;
  subtotal: number;
  createdAt: string;
  items: { id: string; productId: string; productName: string; quantity: number; price: number }[];
}

export interface ChartPoint { date: string; revenue: number; orders: number }

export interface SellerAnalytics {
  chart: ChartPoint[];
  summary: { totalRevenue: number; totalOrders: number; avgOrderValue: number };
}

export interface SellerSettings {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: string;
}

interface Paginated<T> { data: T[]; pagination: { page: number; limit: number; total: number; totalPages: number } }

// ─── API calls ────────────────────────────────────────────────────────────────

export const sellerApi = {
  getDashboard: () => req<{ success: true; data: SellerStats }>('/dashboard').then(r => r.data),

  getProducts: (page = 1, limit = 20) =>
    req<{ success: true } & Paginated<SellerProduct>>(`/products?page=${page}&limit=${limit}`),

  createProduct: (data: SellerProductInput) =>
    req<{ success: true; data: SellerProduct }>('/products', { method: 'POST', body: JSON.stringify(data) }).then(r => r.data),

  updateProduct: (id: string, data: Partial<SellerProductInput>) =>
    req<{ success: true; data: SellerProduct }>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }).then(r => r.data),

  deleteProduct: (id: string) =>
    req<{ success: true }>(`/products/${id}`, { method: 'DELETE' }),

  getOrders: (page = 1) =>
    req<{ success: true } & Paginated<SellerOrder>>(`/orders?page=${page}`),

  updateOrderStatus: (orderId: string, status: string) =>
    req<{ success: true }>(`/orders/${orderId}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),

  getAnalytics: (period: '7d' | '30d' | '90d' = '30d') =>
    req<{ success: true; data: SellerAnalytics }>(`/analytics?period=${period}`).then(r => r.data),

  getSettings: () =>
    req<{ success: true; data: SellerSettings }>('/settings').then(r => r.data),

  updateSettings: (data: Partial<Pick<SellerSettings, 'firstName' | 'lastName' | 'phone' | 'avatar'>>) =>
    req<{ success: true; data: SellerSettings }>('/settings', { method: 'PUT', body: JSON.stringify(data) }).then(r => r.data),
};
