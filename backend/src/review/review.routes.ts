import { Router } from 'express';
import { createReview, getReviewsForCaravan } from './review.controller';

const router = Router();

// Note: In a real app, the POST route would be protected
// and the authorId would be extracted from the authentication token.

router.post('/', createReview);
router.get('/caravan/:caravanId', getReviewsForCaravan);

export default router;
