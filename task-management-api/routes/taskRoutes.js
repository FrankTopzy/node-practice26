import express from 'express';
import validate from "../middlewares/validate.js";
import authenticate from "../middlewares/authenticate.js";
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
  taskQuerySchema
} from "../schemas/taskSchema.js";
import { getAllTasks, getTaskById, createTask, updateTask, deleteTask, toggleTaskCompletion } from '../controllers/taskController.js';

const router = express.Router();


router.route("/")
  .get(authenticate, validate(taskQuerySchema, "query"), getAllTasks)
  .post(authenticate, validate(createTaskSchema), createTask)
  

router.route('/:id')
  .get(authenticate, validate(taskIdSchema, "params"), getTaskById)
  .put(
    authenticate,
    validate(taskIdSchema, "params"), 
    validate(updateTaskSchema), 
    updateTask)
  .delete(authenticate, validate(taskIdSchema, "params"), deleteTask);

router.patch("/:id/complete", authenticate, validate(taskIdSchema, "params"), toggleTaskCompletion);

export default router;