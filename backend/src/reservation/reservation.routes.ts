import { Router } from 'express';
import { createReservation, getMyReservations } from './reservation.controller';

const router = Router();

// Note: In a real app, the POST and GET /my routes would be protected
// and the user ID would be extracted from the authentication token.

router.post('/', createReservation);
router.get('/my', getMyReservations);

export default router;
