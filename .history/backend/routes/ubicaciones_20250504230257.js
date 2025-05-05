import express from "express";
import Ubicacion from "../models/Ubicacion.js";

const router = express.Router();

// POST - guardar ubicación
router.post("/", async (req, res) => {
  try {
    const nuevaUbicacion = new Ubicacion(req.body); // 👍 ya incluye usuarioLogeado
    await nuevaUbicacion.save();
    res.status(201).json({ success: true });
  } catch (error) {
    console.error("Error al guardar ubicación:", error);
    res.status(500).json({ error: "Error al guardar ubicación" });
  }
});

// GET - historial por usuarioLogeado
router.get("/:usuario", async (req, res) => {
  try {
    const { usuario } = req.params;
    const ubicaciones = await Ubicacion.find({ usuarioLogeado: usuario }).sort({
      time: -1,
    });
    res.json(ubicaciones);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener historial" });
  }
});

export default router;
