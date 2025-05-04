import dotenv from "dotenv";
dotenv.config(); // 👈 carga las variables de entorno

import express from "express";
import cors from "cors";
import connectDB from "./db.js"; // 👈 importa la función de conexión
import authRoutes from "./routes/auth.js";

const app = express();
app.use(cors());
app.use(express.json());

connectDB(); // 👈 conecta a MongoDB ✅

app.use("/", authRoutes); // ✅ rutas de login y register

app.listen(4000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:4000");
});
