import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, Popup } from "react-leaflet";
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
  const watchId = useRef(null);

  const toggleTracking = () => {
    if (tracking) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
      setTracking(false);
    } else {
      if (!navigator.geolocation) {
        alert("Tu navegador no soporta geolocalización.");
        return;
      }

      watchId.current = navigator.geolocation.watchPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          console.error("Error de geolocalización:", err);
          alert("Error obteniendo tu ubicación.");
        },
        { enableHighAccuracy: true }
      );
      setTracking(true);
    }
  };

  useEffect(() => {
    // Obtener ubicación inicial (sin seguimiento)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.error("Error inicial de geolocalización:", err);
      }
    );

    return () => {
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current);
      }
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

          {/* Botón centrado sobre el mapa */}
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg pointer-events-auto hover:bg-blue-700"
              onClick={toggleTracking}
            >
              {tracking ? "Detener seguimiento" : "Seguir ubicación"}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-300">Cargando ubicación inicial...</p>
      )}
    </div>
  );
}
