import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api", authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
