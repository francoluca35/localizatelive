// backend/models/Ubicacion.js
import mongoose from "mongoose";

const UbicacionSchema = new mongoose.Schema({
  lat: String,
  lon: String,
  city: String,
  address: String,
  time: String,
  username: String,
});

export default mongoose.models.Ubicacion ||
  mongoose.model("Ubicacion", UbicacionSchema);
