import mongoose from "mongoose";

const ubicacionSchema = new mongoose.Schema({
  lat: String,
  lon: String,
  city: String,
  address: String,
  time: String,
});

export default mongoose.model("Ubicacion", ubicacionSchema);
