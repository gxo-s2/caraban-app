import { Router } from 'express';
import { getMyPayments, createPayment } from './payment.controller';

const router = Router();

// Note: In a real app, these routes would be protected
// and the user ID would be extracted from the authentication token.

// POST /api/payments (결제 처리)
router.post('/', createPayment);

// 🚨 [수정 완료] GET /api/payments (결제 이력 조회)
// 프론트엔드가 호출하는 기본 경로에 getMyPayments 함수를 연결합니다.
router.get('/', getMyPayments); 

export default router;