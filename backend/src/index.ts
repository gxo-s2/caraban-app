import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// 라우터 import
import userRoutes from './user/user.routes';
import caravanRoutes from './caravan/caravan.routes';
import reservationRoutes from './reservation/reservation.routes';
import paymentRoutes from './payment/payment.routes';
import reviewRoutes from './review/review.routes';

console.log("Starting CaravanShare Backend Server...");

const app = express();
const port = process.env.PORT || 3001;

// CORS 설정
const allowedOrigins = [
  'http://localhost:3000', 
  'http://localhost:3002',
];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(options));
app.use(express.json());

// 기본 라우트
app.get('/', (req, res) => {
  res.send('Hello, CaravanShare backend is running!');
});

// API 라우터 연결
app.use('/api/users', userRoutes);
app.use('/api/caravans', caravanRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);

// 🛑 중요: 서버 객체를 변수에 담아 관리
const server = app.listen(port, () => {
  console.log(`✅ CaravanShare backend listening at http://localhost:${port}`);
});

// 🚑 [Clean Exit 방지 1] 강제 심폐소생 (Heartbeat)
// Node.js 이벤트 루프가 비어버려서 종료되는 것을 막기 위해 10분마다 살아있음을 알림
setInterval(() => {
  console.log('💓 Backend server is active...');
}, 1000 * 60 * 10);

// 🚑 [Clean Exit 방지 2] 프로세스 종료 이벤트 감지
// 어디선가 강제로 종료하려고 할 때 로그를 남김
process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});

// 🚑 [Clean Exit 방지 3] 종료 시그널 핸들링 (Ctrl+C 등)
const gracefulShutdown = () => {
  console.log('Received kill signal, shutting down gracefully');
  server.close(() => {
    console.log('Closed out remaining connections');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);