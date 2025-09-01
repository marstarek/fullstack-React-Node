import express from "express";
import { signup, login, profile } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authMiddleware, profile);
router.get("/authUserData", authMiddleware, authUserData);

export default router;
