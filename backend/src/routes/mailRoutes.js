import express from 'express';
import {
  getEmails,
  getEmailById,
  sendEmail,
  deleteEmail,
} from '../controllers/mailController.js';

const router = express.Router();

// Email routes
router.get('/', getEmails);
router.get('/:id', getEmailById);
router.post('/', sendEmail);
router.delete('/:id', deleteEmail);

export default router;
