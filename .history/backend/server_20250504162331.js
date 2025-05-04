const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db");
const authRoutes = require("./routes/auth");

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
