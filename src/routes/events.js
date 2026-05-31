import express from 'express';
import { getEvents, purchaseTicket, createEvent } from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getEvents);
router.post('/purchase', protect, purchaseTicket);

// Internal administrative endpoint to inject events (could be restricted to 'COMPANY' or 'GOVT' roles)
router.post('/create', protect, createEvent);

export default router;