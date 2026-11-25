import express from "express";
import { getUserTasks, registerUser, loginUser, logoutUser, refreshAccessToken } from "../controllers/userController.js";
import authorize from "../middlewares/authorize.js";
import { registerUserSchema, loginUserSchema } from "../schemas/userSchema.js";
import validate from "../middlewares/validate.js";
import authenticate from "../middlewares/authenticate.js";


const router = express.Router();

router.post("/register", validate(registerUserSchema), registerUser);

router.post("/login", validate(loginUserSchema), loginUser);

router.post("/logout", logoutUser);

router.get("/me/tasks", authenticate, getUserTasks);

router.post("/refresh", refreshAccessToken);
//router.get("/admin-test", authenticate, authorize("admin"), adminTest);

export default router;
