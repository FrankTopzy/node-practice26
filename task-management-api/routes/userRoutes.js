import express from "express";
import { getUserTasks, registerUser, loginUser, logoutUser, refreshAccessToken } from "../controllers/userController.js";
import authorize from "../middlewares/authorize.js";
import { registerUserSchema, loginUserSchema } from "../schemas/userSchema.js";
import validate from "../middlewares/validate.js";
import authenticate from "../middlewares/authenticate.js";
import verifyOrigin from "../middlewares/verifyOrigin.js";
import generateCsrfToken from "../controllers/csrfController.js";
import verifyCsrfToken from "../middlewares/verifyCsrfToken.js";
import { loginLimiter, registerLimiter, refreshLimiter} from "../middlewares/authRateLimiter.js";


const router = express.Router();

router.post("/register", validate(registerUserSchema), registerLimiter, registerUser);

router.post("/login", loginLimiter, validate(loginUserSchema), loginUser);

router.post("/logout", verifyOrigin, verifyCsrfToken, logoutUser);

router.post("/refresh", verifyOrigin, verifyCsrfToken, refreshLimiter, refreshAccessToken);

router.get("/me/tasks", authenticate, getUserTasks);

router.get("/csrf-token", generateCsrfToken);

//router.get("/admin-test", authenticate, authorize("admin"), adminTest);

export default router;
