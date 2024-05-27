import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "./cron/cleanupExpiredOtps.js";
import authMiddleware from "./middlewares/authMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
// import { checkRole } from "./middlewares/roleMiddleware.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/product", authMiddleware, productRoutes);
// app.use("/api/admins-only", authMiddleware, checkRole("admin"), adminRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server is up on ${PORT}`));
