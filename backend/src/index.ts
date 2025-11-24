import 'dotenv/config'; // 환경 변수 로드
import express from 'express';
import cors from 'cors';

// 🚨 [가장 중요한 부분] 회원 인증 라우터 import (이 줄이 빠지면 오류 발생)
import userRouter from './user/user.controller'; // user 라우터 로직 import
import caravanRoutes from './caravan/caravan.routes'; // 카라반 라우터 import
import reservationRoutes from './reservation/reservation.routes'; // 예약 라우터 import
import paymentRoutes from './payment/payment.routes'; // 결제 라우터 import
import reviewRoutes from './review/review.routes'; // 리뷰 라우터 import

const app = express();
const port = process.env.PORT || 3001;

app.use(cors()); // CORS 활성화
app.use(express.json()); // JSON 파싱 활성화

app.get('/', (req, res) => {
  res.send('Hello, CaravanShare backend!');
});

// 🚨 [최종 연결] 회원 인증 라우터를 /api/auth 경로에 연결
app.use('/api/auth', userRouter); 

// 다른 도메인 라우터 연결 (API 경로 접두사 설정)
app.use('/api/caravans', caravanRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);


app.listen(port, () => {
  console.log(`CaravanShare backend listening at http://localhost:${port}`);
});