import express from "express";
import Ubicacion from "../models/Ubicacion.js";

const router = express.Router();

// POST - guardar ubicación
router.post("/", async (req, res) => {
  try {
    const nuevaUbicacion = new Ubicacion(req.body);
    await nuevaUbicacion.save();
    res.status(201).json({ success: true });
  } catch (error) {
    console.error("Error al guardar ubicación:", error);
    res.status(500).json({ error: "Error al guardar ubicación" });
  }
});

// GET - historial por usuario
router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const ubicaciones = await Ubicacion.find({ username }).sort({ time: -1 });
    res.json(ubicaciones);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener historial" });
  }
});

export default router;
