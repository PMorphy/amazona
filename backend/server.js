import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from './config/db.js';

// import data from './data.js';

import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';

// Support
dotenv.config();
colors.enable();

// app Object
const app = express();

// Cross Platform
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Port assignment
const PORT = process.env.PORT || 5000;

// DB Connect
connectDB();

// PAYPAL
app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

// Routes
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

// Async Error Handler
app.use((error, req, res, next) => {
  res.status(500).send({ message: error.message });
});

// Server Listening
app.listen(PORT, () => {
  console.log(`Server Started on: http://localhost:${PORT}`);
});
