import { Request, Response } from 'express';
import AppDataSource from '../database/data-source';
import { Category } from '../database/entities/Category';

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const raw = await AppDataSource.getRepository(Category)
      .createQueryBuilder('category')
      .leftJoin('category.products', 'product', 'product.isActive = true')
      .select([
        'category.id AS id',
        'category.name AS name',
        'category.slug AS slug',
        'category.description AS description',
        'category.image AS image',
      ])
      .addSelect('COUNT(product.id)', 'productCount')
      .where('category.isActive = :isActive', { isActive: true })
      .groupBy('category.id')
      .orderBy('category.name', 'ASC')
      .getRawMany();

    const data = raw.map(r => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description,
      image: r.image,
      productCount: Number(r.productCount),
    }));

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
