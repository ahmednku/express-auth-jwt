import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
const prisma = new PrismaClient();

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = generateToken(user.id);
    return res.status(200).json({ message: "login", token });
  }
  return res.status(400).json({ message: "invalid credentials" });
};

const register = async (req, res) => {
  const { fullname, email, password } = req.body;
  if (!fullname || !email || !password)
    return res.status(400).json({ message: "Invalid request" });
  const alreadyExist = await prisma.user.findFirst({ where: { email } });
  if (alreadyExist)
    return res
      .status(400)
      .json({ message: "user with specified email already exists" });
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name: fullname, email, password: hashedPassword },
  });
  if (user) {
    const token = generateToken(user.id);
    return res.status(200).json({ message: "register", token });
  }
  return res.status(500).json({ message: "something went wrong." });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: "User not found" });
  const token = generateToken(user.id);
  await prisma.user.update({
    where: { email },
    data: { resetToken: token },
  });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  const subject = "Password Reset Request";
  const text = `You requested a password reset. Click the link to reset your password: ${resetUrl}`;
  const html = `<p>You requested a password reset. Click the link to reset your password:</p><a href="${resetUrl}">Reset Password</a>`;

  await sendEmail(user.email, subject, text, html);

  return res.status(200).json({ message: "Password reset email sent" });
};

const resetPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: decoded.id },
      data: { password: hashedPassword, resetToken: null },
    });
    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

const getAllUsers = async (req, res) => {
  return res.status(200).json({ users: await prisma.user.findMany() });
};

const verifyOtp = (req, res) => {
  const { otp } = req.body;
  return res.status(200).json({ message: "verifyOtp" });
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export {
  forgotPassword,
  getAllUsers,
  login,
  register,
  resetPassword,
  verifyOtp,
};
