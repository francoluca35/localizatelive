import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import ubicacionesRoutes from "./routes/ubicaciones.js";

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api", ubicacionesRoutes); // Importante

app.listen(4000, () => {
  console.log("✅ Servidor corriendo en http://localhost:4000");
});
