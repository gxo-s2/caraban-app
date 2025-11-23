import { Router } from 'express';
import { createPayment, getMyPayments } from './payment.controller';

const router = Router();

// Note: In a real app, these routes would be protected
// and the user ID would be extracted from the authentication token.

router.post('/', createPayment);
router.get('/my', getMyPayments);

export default router;
