import express from "express";
import Ubicacion from "../models/Ubicacion.js";

const router = express.Router();

router.post("/ubicaciones", async (req, res) => {
  try {
    const nueva = new Ubicacion(req.body);
    await nueva.save();
    res.status(201).json({ success: true });
  } catch (error) {
    console.error("Error al guardar ubicación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/ubicaciones", async (req, res) => {
  try {
    const data = await Ubicacion.find().sort({ time: -1 });
    res.json(data);
  } catch (error) {
    console.error("Error al obtener ubicaciones:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
