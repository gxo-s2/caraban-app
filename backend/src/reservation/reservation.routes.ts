import { Router } from 'express';
// ✅ [중요] 방금 수정한 컨트롤러의 함수들을 가져옵니다.
import { 
  createReservation, 
  getUserReservations, 
  getHostReservations, 
  updateReservationStatus 
} from './reservation.controller';

const router = Router();

// 🔍 [디버깅] 요청이 이 라우터 파일까지 들어오는지 확인하는 로그 미들웨어
router.use((req, res, next) => {
  console.log(`🛣️ [Router] 요청 도착: ${req.method} ${req.originalUrl}`);
  next();
});

// ==========================================
// Guest Routes
// ==========================================

router.post('/', createReservation);

// ✅ [수정] Express 라우터 핸들러 등록 방식 수정
// 기존: getUserReservations(req, res).catch(next) -> Express가 함수 자체를 원함
// 수정: getUserReservations 함수 자체를 전달하거나, async 핸들러 래퍼 사용
router.get('/user/:userId', getUserReservations);


// ==========================================
// Host Routes
// ==========================================

router.get('/host/:hostId', getHostReservations);
router.patch('/:id/status', updateReservationStatus);

export default router;