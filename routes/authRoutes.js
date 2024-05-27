import express from "express";
import {
  forgotPassword,
  getAllUsers,
  login,
  register,
  resetPassword,
  sendOtp,
  verifyOtp,
} from "../controllers/authController.js";
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/users", getAllUsers);
router.post("/verify-otp", verifyOtp);
router.post("/send-otp", sendOtp);

export default router;
