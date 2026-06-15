import { Request, Response } from 'express';
import AppDataSource from '../database/data-source';
import { Product } from '../database/entities/Product';

type SortKey = 'price-asc' | 'price-desc' | 'rating' | 'reviews';

function repo() {
  return AppDataSource.getRepository(Product);
}

function formatProduct(p: Product) {
  return {
    id: p.id,
    name: p.name,
    category: p.category?.slug ?? '',
    price: Number(p.price),
    originalPrice: p.originalPrice != null ? Number(p.originalPrice) : null,
    rating: Number(p.rating),
    reviews: p.reviewCount,
    badge: p.badge ?? null,
    iconKey: p.iconKey ?? 'package',
    description: p.description,
    features: p.features ?? [],
    specs: p.specs ?? {},
    isFeatured: p.isFeatured,
    stock: p.stock,
  };
}

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 12));
    const category = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;
    const sort = req.query.sort as SortKey | undefined;
    const featured = req.query.featured === 'true';

    const qb = repo()
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.isActive = :isActive', { isActive: true });

    if (category && category !== 'all') {
      qb.andWhere('category.slug = :slug', { slug: category });
    }

    const minPrice = req.query.minPrice !== undefined && req.query.minPrice !== '' ? Number(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice !== undefined && req.query.maxPrice !== '' ? Number(req.query.maxPrice) : undefined;

    if (search) {
      qb.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (minPrice !== undefined && !isNaN(minPrice)) {
      qb.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined && !isNaN(maxPrice)) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    if (featured) {
      qb.andWhere('product.isFeatured = :isFeatured', { isFeatured: true });
    }

    switch (sort) {
      case 'price-asc':  qb.orderBy('product.price', 'ASC'); break;
      case 'price-desc': qb.orderBy('product.price', 'DESC'); break;
      case 'rating':     qb.orderBy('product.rating', 'DESC'); break;
      case 'reviews':    qb.orderBy('product.reviewCount', 'DESC'); break;
      default:
        qb.orderBy('product.isFeatured', 'DESC').addOrderBy('product.createdAt', 'DESC');
    }

    const [products, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    console.log(`[ProductController] Fetched products: ${products}`);

    res.status(200).json({
      success: true,
      data: products.map(formatProduct),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await repo().findOne({
      where: { id, isActive: true },
      relations: ['category'],
    });

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.status(200).json({ success: true, data: formatProduct(product) });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = repo().create(req.body);
    const saved = await repo().save(product);
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await repo().update(id, req.body);
    const updated = await repo().findOne({ where: { id }, relations: ['category'] });
    if (!updated) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    res.status(200).json({ success: true, data: formatProduct(updated) });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await repo().update(id, { isActive: false });
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
