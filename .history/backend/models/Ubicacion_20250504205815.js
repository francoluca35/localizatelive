const mongoose = require("mongoose");

const ubicacionSchema = new mongoose.Schema({
  lat: String,
  lon: String,
  city: String,
  address: String,
  time: String,
});

module.exports = mongoose.model("Ubicacion", ubicacionSchema);
