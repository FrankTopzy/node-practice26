import express from 'express';
import validate from "../middlewares/validate.js";
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
  taskQuerySchema
} from "../schemas/taskSchema.js";
import { getAllTasks, getTaskById, createTask, updateTask, deleteTask, toggleTaskCompletion } from '../controllers/taskController.js';

const router = express.Router();


router.route("/")
  .get(validate(taskQuerySchema, "query"), getAllTasks)
  .post(validate(createTaskSchema), createTask)
  

router.route('/:id')
  .get(validate(taskIdSchema, "params"), getTaskById)
  .put(
    validate(taskIdSchema, "params"), 
    validate(updateTaskSchema), 
    updateTask)
  .delete(validate(taskIdSchema, "params"), deleteTask);

router.patch("/:id/complete", validate(taskIdSchema, "params"), toggleTaskCompletion);

export default router;