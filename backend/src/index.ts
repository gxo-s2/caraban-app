import 'dotenv/config'; // Load environment variables first
import express from 'express';
import userController from './user/user.controller'; // Import the user controller
import caravanRoutes from './caravan/caravan.routes'; // Import caravan routes
import reservationRoutes from './reservation/reservation.routes'; // Import reservation routes
import paymentRoutes from './payment/payment.routes'; // Import payment routes
import reviewRoutes from './review/review.routes'; // Import review routes

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json()); // Enable JSON body parsing

app.get('/', (req, res) => {
  res.send('Hello, CaravanShare backend!');
});

// Mount user routes
app.use('/api/users', userController);

// Mount caravan routes
app.use('/api/caravans', caravanRoutes);

// Mount reservation routes
app.use('/api/reservations', reservationRoutes);

// Mount payment routes
app.use('/api/payments', paymentRoutes);

// Mount review routes
app.use('/api/reviews', reviewRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
