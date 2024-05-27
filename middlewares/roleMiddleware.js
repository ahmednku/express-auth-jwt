import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const checkRole = (requiredRole) => {
  return async (req, res, next) => {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user && user.role === requiredRole) {
      next();
    } else {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
  };
};

export { checkRole };
