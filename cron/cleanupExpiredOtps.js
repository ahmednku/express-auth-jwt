import { PrismaClient } from "@prisma/client";
import cron from "node-cron";

const prisma = new PrismaClient();

const cleanupExpiredOtps = async () => {
  try {
    const result = await prisma.otp.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  } catch (error) {
    console.error("Error cleaning up expired OTPs:", error);
  }
};

// Schedule the cleanup to run every hour
cron.schedule("0 * * * *", cleanupExpiredOtps);
