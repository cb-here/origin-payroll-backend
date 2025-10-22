import express from "express";
import {
  login,
  logout,
  forgotPassword,
  resetPassword,
  register,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

// Protected routes
router.post("/logout", protect, logout);

export default router;
