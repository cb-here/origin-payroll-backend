import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import dotenv from "dotenv";
import { connectDB } from "./db/database.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
