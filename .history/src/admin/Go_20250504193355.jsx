import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

function UpdateCenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 15);
  }, [position, map]);
  return null;
}

export default function Go() {
  const [position, setPosition] = useState(null);
  const [tracking, setTracking] = useState(false);
  const intervalRef = useRef(null);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setPosition(coords);
        },
        (err) => {
          console.error("Error obteniendo ubicación:", err);
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Tu navegador no soporta geolocalización.");
    }
  };

  const toggleTracking = () => {
    if (tracking) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setTracking(false);
    } else {
      getCurrentLocation(); // obtiene la inicial
      intervalRef.current = setInterval(() => {
        getCurrentLocation(); // actualiza cada 10s
      }, 10000);
      setTracking(true);
    }
  };

  useEffect(() => {
    getCurrentLocation();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">LocalizateGo</h1>

      {position ? (
        <div className="relative">
          <MapContainer
            center={position}
            zoom={15}
            style={{ height: "500px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={position}>
              <Popup>Estás aquí</Popup>
            </Marker>
            <UpdateCenter position={position} />
          </MapContainer>

          {/* Botón centrado */}
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
            <button
              className="bg-green-600 text-white px-6 py-3 rounded-full shadow-lg pointer-events-auto hover:bg-green-700"
              onClick={toggleTracking}
            >
              {tracking ? "Detener seguimiento" : "Iniciar seguimiento"}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-300">Obteniendo ubicación inicial...</p>
      )}
    </div>
  );
}
