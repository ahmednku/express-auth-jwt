import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

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
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const alreadyExist = await prisma.user.findFirst({ where: { email } });
  if (alreadyExist)
    return res
      .status(400)
      .json({ message: "user with specified email already exists" });
  const user = await prisma.user.create({
    data: { name: fullname, email, password: hashedPassword },
  });
  if (user) {
    const token = generateToken(user.id);
    return res.status(200).json({ message: "register", token });
  }
  return res.status(500).json({ message: "something went wrong." });
};

const forgotPassword = (req, res) => {
  const { email } = req.body;
  return res.status(200).json({ message: "forgot password" });
};

const verifyOtp = (req, res) => {
  const { otp } = req.body;
  return res.status(200).json({ message: "verifyOtp" });
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export { forgotPassword, login, register, verifyOtp };
