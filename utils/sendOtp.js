// utils/otp.js
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import sendEmail from "./sendEmail.js";

const prisma = new PrismaClient();

const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const sendOtpCode = async (email) => {
  const otp = generateOtp();
  const subject = "Your OTP Code";
  const text = `Your OTP code is ${otp}`;

  await sendEmail(email, subject, text);

  await prisma.otp.create({
    data: {
      email,
      otp,
      expiresAt: new Date(Date.now() + 300000),
    },
  });

  console.log(`OTP sent to ${email}: ${otp}`);
};

const verifyOtpCode = async (email, otp) => {
  const otpEntry = await prisma.otp.findFirst({
    where: {
      email,
      otp,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (otpEntry) {
    await prisma.otp.delete({
      where: {
        id: otpEntry.id,
      },
    });
    return true;
  }
  return false;
};

export { sendOtpCode, verifyOtpCode };
