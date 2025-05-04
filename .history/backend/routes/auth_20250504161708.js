import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Registro
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashed,
      role: "admin",
    });
    res.status(201).json({
      message: "Usuario registrado",
      user: { username: user.username, role: user.role },
    });
  } catch (err) {
    res.status(400).json({ error: "Usuario ya existe o error de datos" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "2h" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

export default router;
