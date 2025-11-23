import { Router } from 'express';
import { createCaravan, getAllCaravans } from './caravan.controller';

const router = Router();

router.post('/', createCaravan);
router.get('/', getAllCaravans);

export default router;
