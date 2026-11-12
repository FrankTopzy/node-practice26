import express from 'express';
import taskRoutes  from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import dotenv from 'dotenv';

dotenv.config();


const PORT = process.env.PORT || 3500;

const app = express();

app.use(express.json());

app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);

app.listen(PORT, () => console.log(`Server Running on PORT ${PORT}`))