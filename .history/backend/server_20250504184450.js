import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config(); // ✅ Carga las variables .env

import mongoose from "mongoose";
import connectDB from "./db.js"; // ✅ conexión MongoDB

connectDB(); // ✅ llama la conexión

app.use("/", authRoutes); // ✅ importante para que funcione /login

app.listen(4000, () => {
  console.log("Servidor corriendo en http://localhost:4000");
});
