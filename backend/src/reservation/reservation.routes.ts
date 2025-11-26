import { Router } from 'express';
// ✅ [중요] 방금 수정한 컨트롤러의 함수들을 가져옵니다.
import { 
  createReservation, 
  getUserReservations, 
  getHostReservations, 
  updateReservationStatus,
  lookupReservation
} from './reservation.controller';

const router = Router();

// 🔍 [디버깅] 요청이 이 라우터 파일까지 들어오는지 확인하는 로그 미들웨어
router.use((req, res, next) => {
  console.log(`🛣️ [Router] 요청 도착: ${req.method} ${req.originalUrl}`);
  next();
});

// ==========================================
// Public Routes
// ==========================================
router.get('/lookup/:id', lookupReservation);


// ==========================================
// Guest Routes
// ==========================================

router.post('/', createReservation);

// ✅ [핵심] 프론트엔드가 호출하는 경로 (/user/:userId)
router.get('/user/:userId', (req, res, next) => {
  console.log('🔎 [Router] GET /user/:userId 매칭됨. 컨트롤러로 이동합니다.');
  getUserReservations(req, res).catch(next);
});


// ==========================================
// Host Routes
// ==========================================

router.get('/host/:hostId', getHostReservations);
router.patch('/:id/status', updateReservationStatus);

export default router;