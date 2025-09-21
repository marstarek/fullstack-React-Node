import express from "express";
import { signup, login, profile, authUserData } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roles.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authMiddleware, profile);
router.get("/authUserData", authMiddleware, authUserData);

export default router;