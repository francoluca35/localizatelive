import mongoose from "mongoose";

const UbicacionSchema = new mongoose.Schema({
  lat: String,
  lon: String,
  city: String,
  address: String,
  time: String,
  usuarioLogeado: String, // ✅ ESTE CAMPO TIENE QUE ESTAR
});

export default mongoose.models.Ubicacion ||
  mongoose.model("Ubicacion", UbicacionSchema);
