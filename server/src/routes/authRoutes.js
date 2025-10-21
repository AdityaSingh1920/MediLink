import express from "express";
const router = express.Router();
import { signup, verifyEmail, login, logout, deleteAccount,refreshToken } from "../controller/authController.js";
import { authMiddleware } from '../middleware/authmiddleware.js';

router.post("/signup",  signup);
router.post("/verify", verifyEmail);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.delete("/delete/:id",authMiddleware,deleteAccount)

export default router;
