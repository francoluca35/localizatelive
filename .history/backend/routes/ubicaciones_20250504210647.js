import express from "express";
import Ubicacion from "../models/Ubicacion.js";

const router = express.Router();

// POST /api/ubicaciones → guardar ubicación
router.post("/", async (req, res) => {
  try {
    const nueva = new Ubicacion(req.body);
    const guardada = await nueva.save();
    res.status(201).json({ success: true, data: guardada });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/ubicaciones → ver historial
router.get("/", async (req, res) => {
  try {
    const historial = await Ubicacion.find().sort({ time: -1 });
    res.status(200).json(historial);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
