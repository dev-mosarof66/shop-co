/**
 * Sample Product Model
 * Replace with your actual database implementation
 */

interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  sku: string;
  stock: number;
  images: string[];
  tags?: string[];
  rating?: number;
  reviews?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface IProductVariant {
  id: string;
  productId: string;
  name: string;
  values: string[];
  price?: number;
  stock?: number;
}

export { IProduct, IProductVariant };
