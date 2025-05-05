// backend/routes/ubicaciones.js
import express from "express";
import Ubicacion from "../models/Ubicacion.js";
const router = express.Router();

// GET: solo las ubicaciones del usuario
router.get("/", async (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: "Falta el username" });

  const ubicaciones = await Ubicacion.find({ username });
  res.json(ubicaciones);
});

router.post("/", async (req, res) => {
  const ubicacion = new Ubicacion(req.body);
  await ubicacion.save();
  res.status(201).json({ success: true });
});

export default router;
