import express from 'express';
import { checkEmail } from '../controllers/checkEmailController.js';
import { validateEmail } from '../controllers/validateEmailController.js';
import { rateLimitMiddleware } from '../utils/rateLimiter.js';

const router = express.Router();

// Apply rate limiting to all routes
router.use(rateLimitMiddleware);

// Email checking and validation routes
router.post('/check-email', checkEmail);
router.post('/validate-email', validateEmail);

export default router;
