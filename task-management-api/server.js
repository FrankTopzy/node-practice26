import express from 'express';
import taskRoutes  from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

const PORT = process.env.PORT || 3500;

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);

app.listen(PORT, () => console.log(`Server Running on PORT ${PORT}`))