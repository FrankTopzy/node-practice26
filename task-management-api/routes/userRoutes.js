import express from "express";
import { getUserTasks, registerUser, loginUser } from "../controllers/userController.js";

import { registerUserSchema, loginUserSchema } from "../schemas/userSchema.js";

import validate from "../middlewares/validate.js";

const router = express.Router();

router.post("/register", validate(registerUserSchema), registerUser);

router.post("/login", validate(loginUserSchema), loginUser);

router.route("/:id/tasks")
  .get(getUserTasks);

export default router;