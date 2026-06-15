import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE = `${(import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:5000'}/api/v1`;

export interface ApiProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number | null;
  rating: number;
  reviews: number;
  badge: string | null;
  iconKey: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
  isFeatured: boolean;
  stock: number;
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  productCount: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductsResult {
  data: ApiProduct[];
  pagination: Pagination;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: string;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

function toParams(filters?: ProductFilters): Record<string, string> {
  const p: Record<string, string> = {};
  if (!filters) return p;
  if (filters.page !== undefined) p.page = String(filters.page);
  if (filters.limit !== undefined) p.limit = String(filters.limit);
  if (filters.category) p.category = filters.category;
  if (filters.search) p.search = filters.search;
  if (filters.sort) p.sort = filters.sort;
  if (filters.featured) p.featured = 'true';
  if (filters.minPrice !== undefined) p.minPrice = String(filters.minPrice);
  if (filters.maxPrice !== undefined) p.maxPrice = String(filters.maxPrice);
  return p;
}

export const shopApi = createApi({
  reducerPath: 'shopApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE, credentials: 'include' }),
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResult, ProductFilters | void>({
      query: (filters?: ProductFilters) => ({ url: '/products', params: toParams(filters) }),
      transformResponse: (raw: { data: ApiProduct[]; pagination: Pagination }) => ({
        data: raw.data,
        pagination: raw.pagination,
      }),
    }),
    getProduct: builder.query<ApiProduct, string>({
      query: (id) => `/products/${id}`,
      transformResponse: (raw: { data: ApiProduct }) => raw.data,
    }),
    getRelatedProducts: builder.query<ApiProduct[], { categorySlug: string; excludeId: string }>({
      query: ({ categorySlug }) => ({ url: '/products', params: { category: categorySlug, limit: '5' } }),
      transformResponse: (raw: { data: ApiProduct[] }, _meta, arg) =>
        raw.data.filter(p => p.id !== arg.excludeId).slice(0, 4),
    }),
    getCategories: builder.query<ApiCategory[], void>({
      query: () => '/categories',
      transformResponse: (raw: { data: ApiCategory[] }) => raw.data,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetRelatedProductsQuery,
  useGetCategoriesQuery,
  useLazyGetProductsQuery,
} = shopApi;
