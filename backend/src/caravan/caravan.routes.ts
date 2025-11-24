import { Router } from 'express';
// [수정] getCaravanById 함수를 추가로 import 합니다.
import { createCaravan, getAllCaravans, getCaravanById } from './caravan.controller';

const router = Router();

// POST /api/caravans (카라반 등록)
router.post('/', createCaravan); 

// GET /api/caravans (전체 목록 조회)
router.get('/', getAllCaravans);

// [추가] GET /api/caravans/:id (단일 카라반 상세 조회)
// 이 라우터가 프론트엔드에서 요청한 UUID 주소(예: /caravans/cmibwu...)를 처리합니다.
router.get('/:id', getCaravanById);

export default router;