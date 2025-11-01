import express from 'express';
import mailRoutes from './mailRoutes.js';
import emailCheckRoutes from './emailCheckRoutes.js';

const router = express.Router();

// Mount routes
router.use('/emails', mailRoutes);
router.use('/', emailCheckRoutes);

// Root API route
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Gatto Mail API',
    version: '1.0.0',
    endpoints: {
      checkEmail: '/api/v1/check-email',
      validateEmail: '/api/v1/validate-email',
      emails: '/api/v1/emails',
      health: '/health',
    },
  });
});

export default router;
