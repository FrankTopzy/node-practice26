import express from "express";
import { verifyApiKey } from "../middleware/verifyEvents.js";
import { getAllUsers } from "../controllers/usersController.js";

const router = express.Router();

router.get("/users", verifyApiKey, getAllUsers);

export default router;