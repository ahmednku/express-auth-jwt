import express from "express";
import {
  forgotPassword,
  login,
  register,
  verifyOtp,
} from "../controllers/authController.js";
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyOtp", verifyOtp);

export default router;
