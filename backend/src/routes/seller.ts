import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';
import {
  getDashboard,
  getSellerProducts,
  createSellerProduct,
  updateSellerProduct,
  deleteSellerProduct,
  getSellerOrders,
  updateOrderStatus,
  getAnalytics,
  getSettings,
  updateSettings,
} from '../controllers/sellerController';

const router = Router();

router.use(requireAuth, requireRole('vendor', 'admin'));

router.get('/dashboard', getDashboard);

router.get('/products', getSellerProducts);
router.post('/products', createSellerProduct);
router.put('/products/:id', updateSellerProduct);
router.delete('/products/:id', deleteSellerProduct);

router.get('/orders', getSellerOrders);
router.put('/orders/:orderId/status', updateOrderStatus);

router.get('/analytics', getAnalytics);

router.get('/settings', getSettings);
router.put('/settings', updateSettings);

export default router;
