// backend/routes/ubicaciones.js
import express from "express";
import mongoose from "mongoose";

const router = express.Router();

const UbicacionSchema = new mongoose.Schema({
  lat: String,
  lon: String,
  city: String,
  address: String,
  time: String,
});

const Ubicacion = mongoose.model("Ubicacion", UbicacionSchema, "ubicacion");

// POST /api/ubicaciones
router.post("/", async (req, res) => {
  try {
    const nueva = new Ubicacion(req.body);
    await nueva.save();
    res.status(201).json({ mensaje: "Ubicación guardada correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al guardar ubicación" });
  }
});

// GET /api/ubicaciones
router.get("/", async (req, res) => {
  try {
    const lista = await Ubicacion.find().sort({ time: -1 });
    res.json(lista);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener historial" });
  }
});

export default router;
