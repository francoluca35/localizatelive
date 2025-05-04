import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import connectDB from "./db.js";

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Las rutas deben tener prefijo si quieres controlarlo
app.use("/api", authRoutes);

app.listen(4000, () => {
  console.log("✅ Servidor corriendo en http://localhost:4000");
});
