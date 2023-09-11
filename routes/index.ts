import { Router } from 'express';

import authRouter from './authRoutes';
import userRoutes from './userRoutes';
import productRoutes from './productRoutes';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRoutes);
router.use('/products', productRoutes);

router.all('*', (req, res, next) => {
  res.status(404).json({
    status: false,
    message: `Endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});
export default router;
