// models/Ubicacion.js
import mongoose from "mongoose";

const ubicacionSchema = new mongoose.Schema({
  lat: String,
  lon: String,
  city: String,
  address: String,
  time: String,
  username: String, // 👈 nuevo campo para asociar al usuario
});

export default mongoose.models.Ubicacion ||
  mongoose.model("Ubicacion", ubicacionSchema);
