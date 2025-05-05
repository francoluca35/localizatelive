const express = require("express");
const router = express.Router();
const Ubicacion = require("../models/Ubicacion");

// Guardar nueva ubicación
router.post("/", async (req, res) => {
  try {
    const nueva = new Ubicacion(req.body);
    const guardada = await nueva.save();
    res.status(201).json({ success: true, data: guardada });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Obtener historial
router.get("/", async (req, res) => {
  try {
    const historial = await Ubicacion.find().sort({ time: -1 });
    res.status(200).json(historial);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
