import express from 'express';
import { getUserTasks } from '../controllers/userController.js';


const router = express.Router();

router.route('/:id/tasks')
  .get(getUserTasks)

export default router;