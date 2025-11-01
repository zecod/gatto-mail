import express from 'express';
import mailRoutes from './mailRoutes.js';

const router = express.Router();

// Mount routes
router.use('/emails', mailRoutes);

// Root API route
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Gatto Mail API',
    version: '1.0.0',
    endpoints: {
      emails: '/api/v1/emails',
      health: '/health',
    },
  });
});

export default router;
