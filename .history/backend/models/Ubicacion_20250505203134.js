import mongoose from "mongoose";

const ubicacionSchema = new mongoose.Schema({
  lat: String,
  lon: String,
  city: String,
  address: String,
  time: String,
  usuarioLogeado: String,
});

const Ubicacion =
  mongoose.models.Ubicacion || mongoose.model("Ubicacion", ubicacionSchema);

export default Ubicacion;
