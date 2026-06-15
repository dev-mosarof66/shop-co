import { Request, Response } from 'express';
import { In } from 'typeorm';
import AppDataSource from '../database/data-source';
import { Product } from '../database/entities/Product';
import { Order, OrderStatus } from '../database/entities/Order';
import { OrderItem } from '../database/entities/OrderItem';
import { db } from '../lib/auth';

function sellerId(req: Request) {
  return req.authUser!.id;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const getDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const sid = sellerId(req);
    const productRepo = AppDataSource.getRepository(Product);
    const orderItemRepo = AppDataSource.getRepository(OrderItem);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // Product counts + low stock details
    const [totalProducts, lowStockItems] = await Promise.all([
      productRepo.count({ where: { sellerId: sid, isActive: true } }),
      productRepo
        .createQueryBuilder('p')
        .where('p.sellerId = :sid', { sid })
        .andWhere('p.isActive = true')
        .andWhere('p.stock <= p.lowStockThreshold')
        .andWhere('p.lowStockThreshold > 0')
        .select(['p.id', 'p.name', 'p.stock', 'p.lowStockThreshold', 'p.sku'])
        .orderBy('p.stock', 'ASC')
        .limit(6)
        .getMany(),
    ]);

    // Revenue this month
    const thisMonthRevenue = await orderItemRepo
      .createQueryBuilder('oi')
      .leftJoin('oi.product', 'p')
      .leftJoin('oi.order', 'o')
      .where('p.sellerId = :sid', { sid })
      .andWhere('o.createdAt >= :start', { start: startOfMonth })
      .select('SUM(oi.price * oi.quantity)', 'revenue')
      .addSelect('COUNT(DISTINCT oi.orderId)', 'orders')
      .getRawOne<{ revenue: string; orders: string }>();

    // Revenue last month (for trend)
    const lastMonthRevenue = await orderItemRepo
      .createQueryBuilder('oi')
      .leftJoin('oi.product', 'p')
      .leftJoin('oi.order', 'o')
      .where('p.sellerId = :sid', { sid })
      .andWhere('o.createdAt >= :start', { start: startOfLastMonth })
      .andWhere('o.createdAt <= :end', { end: endOfLastMonth })
      .select('SUM(oi.price * oi.quantity)', 'revenue')
      .getRawOne<{ revenue: string }>();

    // Recent orders (orders containing seller products)
    const recentOrderIds = await orderItemRepo
      .createQueryBuilder('oi')
      .leftJoin('oi.product', 'p')
      .where('p.sellerId = :sid', { sid })
      .select('oi.orderId', 'orderId')
      .groupBy('oi.orderId')
      .orderBy('MAX(oi.createdAt)', 'DESC')
      .limit(5)
      .getRawMany<{ orderId: string }>();

    const recentOrders =
      recentOrderIds.length > 0
        ? await AppDataSource.getRepository(Order).find({
            where: { id: In(recentOrderIds.map(r => r.orderId)) },
            relations: ['items', 'items.product'],
          })
        : [];

    // Revenue by day — last 30 days
    const since30 = new Date();
    since30.setDate(since30.getDate() - 29);
    const revenueRows = await orderItemRepo
      .createQueryBuilder('oi')
      .leftJoin('oi.product', 'p')
      .leftJoin('oi.order', 'o')
      .where('p.sellerId = :sid', { sid })
      .andWhere('o.createdAt >= :since30', { since30 })
      .select("DATE_TRUNC('day', o.createdAt)::date", 'day')
      .addSelect('SUM(oi.price * oi.quantity)', 'revenue')
      .groupBy("DATE_TRUNC('day', o.createdAt)::date")
      .orderBy('day', 'ASC')
      .getRawMany<{ day: string; revenue: string }>();

    const revenueMap = new Map(revenueRows.map(r => [r.day.slice(0, 10), Number(r.revenue)]));
    const revenueChart: { date: string; value: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      revenueChart.push({ date: key, value: revenueMap.get(key) ?? 0 });
    }

    // User signups — last 30 days
    const userRows = await db.query<{ day: string; count: string }[]>(`
      SELECT DATE_TRUNC('day', "createdAt")::date AS day, COUNT(*)::int AS count
      FROM "user"
      WHERE "createdAt" >= NOW() - INTERVAL '29 days'
      GROUP BY DATE_TRUNC('day', "createdAt")::date
      ORDER BY day ASC
    `);
    const userMap = new Map((userRows.rows ?? []).map((r: any) => [String(r.day).slice(0, 10), Number(r.count)]));
    const userGrowth: { date: string; value: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      userGrowth.push({ date: key, value: userMap.get(key) ?? 0 });
    }

    // Top products by revenue
    const topProducts = await orderItemRepo
      .createQueryBuilder('oi')
      .leftJoin('oi.product', 'p')
      .where('p.sellerId = :sid', { sid })
      .select('p.id', 'id')
      .addSelect('p.name', 'name')
      .addSelect('SUM(oi.price * oi.quantity)', 'revenue')
      .addSelect('SUM(oi.quantity)', 'unitsSold')
      .groupBy('p.id')
      .addGroupBy('p.name')
      .orderBy('revenue', 'DESC')
      .limit(5)
      .getRawMany();

    res.json({
      success: true,
      data: {
        revenue: {
          thisMonth: Number(thisMonthRevenue?.revenue ?? 0),
          lastMonth: Number(lastMonthRevenue?.revenue ?? 0),
        },
        orders: {
          thisMonth: Number(thisMonthRevenue?.orders ?? 0),
        },
        products: {
          total: totalProducts,
          lowStock: lowStockItems.length,
          lowStockItems: lowStockItems.map(p => ({
            id: p.id, name: p.name, sku: p.sku, stock: p.stock, threshold: p.lowStockThreshold,
          })),
        },
        recentOrders: recentOrders.map(o => ({
          id: o.id,
          status: o.status,
          total: Number(o.total),
          createdAt: o.createdAt,
          itemCount: o.items?.length ?? 0,
        })),
        topProducts: topProducts.map(p => ({
          id: p.id,
          name: p.name,
          revenue: Number(p.revenue ?? 0),
          unitsSold: Number(p.unitsSold ?? 0),
        })),
        revenueChart,
        userGrowth,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching dashboard', error: String(error) });
  }
};

// ─── Products ─────────────────────────────────────────────────────────────────

export const getSellerProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const sid = sellerId(req);
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));

    const [products, total] = await AppDataSource.getRepository(Product)
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.category', 'category')
      .where('p.sellerId = :sid', { sid })
      .orderBy('p.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    res.json({
      success: true,
      data: products.map(p => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        originalPrice: p.originalPrice != null ? Number(p.originalPrice) : null,
        stock: p.stock,
        lowStockThreshold: p.lowStockThreshold,
        isActive: p.isActive,
        isFeatured: p.isFeatured,
        badge: p.badge,
        iconKey: p.iconKey,
        description: p.description,
        sku: p.sku,
        rating: Number(p.rating),
        reviewCount: p.reviewCount,
        category: p.category ? { id: p.category.id, name: p.category.name, slug: p.category.slug } : null,
        categoryId: p.categoryId,
        features: p.features ?? [],
        specs: p.specs ?? {},
        createdAt: p.createdAt,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching products', error: String(error) });
  }
};

export const createSellerProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const sid = sellerId(req);
    const repo = AppDataSource.getRepository(Product);
    const product = repo.create({ ...req.body, sellerId: sid });
    const saved = await repo.save(product);
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating product', error: String(error) });
  }
};

export const updateSellerProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const sid = sellerId(req);
    const { id } = req.params;
    const repo = AppDataSource.getRepository(Product);
    const product = await repo.findOne({ where: { id, sellerId: sid } });
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    const { sellerId: _s, id: _i, ...updates } = req.body;
    await repo.update(id, updates);
    const updated = await repo.findOne({ where: { id }, relations: ['category'] });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating product', error: String(error) });
  }
};

export const deleteSellerProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const sid = sellerId(req);
    const { id } = req.params;
    const repo = AppDataSource.getRepository(Product);
    const product = await repo.findOne({ where: { id, sellerId: sid } });
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    await repo.update(id, { isActive: false });
    res.json({ success: true, message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting product', error: String(error) });
  }
};

// ─── Orders ───────────────────────────────────────────────────────────────────

export const getSellerOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const sid = sellerId(req);
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));

    // Find order IDs that contain at least one of the seller's products
    const orderItemRepo = AppDataSource.getRepository(OrderItem);
    const orderIdsRaw = await orderItemRepo
      .createQueryBuilder('oi')
      .leftJoin('oi.product', 'p')
      .where('p.sellerId = :sid', { sid })
      .select('DISTINCT oi.orderId', 'orderId')
      .getRawMany<{ orderId: string }>();

    const orderIds = orderIdsRaw.map(r => r.orderId);

    if (orderIds.length === 0) {
      res.json({ success: true, data: [], pagination: { page, limit, total: 0, totalPages: 0 } });
      return;
    }

    const [orders, total] = await AppDataSource.getRepository(Order)
      .createQueryBuilder('o')
      .where('o.id IN (:...ids)', { ids: orderIds })
      .leftJoinAndSelect('o.items', 'item')
      .leftJoinAndSelect('item.product', 'product')
      .orderBy('o.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    res.json({
      success: true,
      data: orders.map(o => ({
        id: o.id,
        status: o.status,
        paymentStatus: o.paymentStatus,
        total: Number(o.total),
        subtotal: Number(o.subtotal),
        createdAt: o.createdAt,
        items: o.items
          .filter(i => (i.product as any)?.sellerId === sid)
          .map(i => ({
            id: i.id,
            productId: i.productId,
            productName: i.product?.name ?? '',
            quantity: i.quantity,
            price: Number(i.price),
          })),
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching orders', error: String(error) });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { status } = req.body as { status: OrderStatus };

    if (!Object.values(OrderStatus).includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status' });
      return;
    }

    await AppDataSource.getRepository(Order).update(orderId, { status });
    res.json({ success: true, message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating order status', error: String(error) });
  }
};

// ─── Analytics ────────────────────────────────────────────────────────────────

export const getAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const sid = sellerId(req);
    const period = String(req.query.period ?? '30d');
    const days = period === '7d' ? 7 : period === '90d' ? 90 : 30;

    const since = new Date();
    since.setDate(since.getDate() - days);

    const rows = await AppDataSource.getRepository(OrderItem)
      .createQueryBuilder('oi')
      .leftJoin('oi.product', 'p')
      .leftJoin('oi.order', 'o')
      .where('p.sellerId = :sid', { sid })
      .andWhere('o.createdAt >= :since', { since })
      .select("DATE_TRUNC('day', o.createdAt)", 'day')
      .addSelect('SUM(oi.price * oi.quantity)', 'revenue')
      .addSelect('COUNT(DISTINCT oi.orderId)', 'orders')
      .groupBy("DATE_TRUNC('day', o.createdAt)")
      .orderBy('day', 'ASC')
      .getRawMany<{ day: string; revenue: string; orders: string }>();

    // Fill in missing days with zero
    const map = new Map(rows.map(r => [r.day.slice(0, 10), r]));
    const chart: { date: string; revenue: number; orders: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const row = map.get(key);
      chart.push({ date: key, revenue: Number(row?.revenue ?? 0), orders: Number(row?.orders ?? 0) });
    }

    const totalRevenue = chart.reduce((s, r) => s + r.revenue, 0);
    const totalOrders = chart.reduce((s, r) => s + r.orders, 0);

    res.json({
      success: true,
      data: {
        chart,
        summary: {
          totalRevenue,
          totalOrders,
          avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching analytics', error: String(error) });
  }
};

// ─── Settings ─────────────────────────────────────────────────────────────────

export const getSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await db.query(
      `SELECT id, name, email, "firstName", "lastName", phone, image, role FROM "user" WHERE id = $1`,
      [sellerId(req)],
    );
    const user = result.rows[0];
    if (!user) { res.status(404).json({ success: false, message: 'User not found' }); return; }
    res.json({
      success: true,
      data: {
        id: user.id,
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        email: user.email,
        phone: user.phone ?? null,
        avatar: user.image ?? null,
        role: user.role ?? 'vendor',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching settings', error: String(error) });
  }
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const sid = sellerId(req);
    const { firstName, lastName, phone, avatar } = req.body as {
      firstName?: string; lastName?: string; phone?: string; avatar?: string;
    };
    await db.query(
      `UPDATE "user" SET "firstName" = $1, "lastName" = $2, phone = $3, image = $4 WHERE id = $5`,
      [firstName ?? null, lastName ?? null, phone ?? null, avatar ?? null, sid],
    );
    const result = await db.query(
      `SELECT id, name, email, "firstName", "lastName", phone, image, role FROM "user" WHERE id = $1`,
      [sid],
    );
    const updated = result.rows[0];
    res.json({
      success: true,
      data: {
        id: updated.id,
        firstName: updated.firstName ?? '',
        lastName: updated.lastName ?? '',
        email: updated.email,
        phone: updated.phone ?? null,
        avatar: updated.image ?? null,
        role: updated.role ?? 'vendor',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating settings', error: String(error) });
  }
};
