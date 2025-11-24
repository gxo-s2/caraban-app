import { Router } from 'express';
import { 
  createReservation, 
  getMyReservations, 
  getReservationsForHost, 
  updateReservationStatus 
} from './reservation.controller';

const router = Router();

// Note: In a real app, these routes would be protected
// and user IDs would be extracted from an authentication token.

// For Guests
router.post('/', createReservation);
router.get('/my', getMyReservations);

// For Hosts
router.get('/host/:hostId', getReservationsForHost);
router.patch('/:reservationId/status', updateReservationStatus);


export default router;
