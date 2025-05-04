import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", authRoutes); // ✅ importante para que funcione /login

app.listen(4000, () => {
  console.log("Servidor corriendo en http://localhost:4000");
});
