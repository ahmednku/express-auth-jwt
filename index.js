import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import authMiddleware from "./middlewares/authMiddleware.js";
import "./cron/cleanupExpiredOtps.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/product", authMiddleware, productRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server is up on ${PORT}`));
