import 'dotenv/config'; // Load environment variables first
import express from 'express';
import userController from './user/user.controller'; // Import the user controller
import caravanRoutes from './caravan/caravan.routes'; // Import caravan routes

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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
