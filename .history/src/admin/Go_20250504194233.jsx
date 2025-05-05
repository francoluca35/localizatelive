import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Icono personalizado como el de tu imagen
const locationIcon = new L.Icon({
  iconUrl: "/location-icon.png", // poné tu ícono aquí o usá el de Leaflet por defecto
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

// Componente auxiliar para mover el mapa al centro cuando cambia la posición
function UpdateMapCenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 15);
  }, [position, map]);
  return null;
}

export default function Go() {
  const [position, setPosition] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);

  const toggleTracking = () => {
    if (!tracking) {
      const id = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (err) => {
          console.error("Error obteniendo ubicación:", err);
        },
        { enableHighAccuracy: true }
      );
      setWatchId(id);
      setTracking(true);
    } else {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setTracking(false);
    }
  };

  return (
    <div className="h-screen w-screen relative">
      <MapContainer
        center={position || [-34.6037, -58.3816]} // centro inicial: Buenos Aires
        zoom={15}
        className="h-full w-full"
      >
        <>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          />
          {position && <Marker position={position} icon={locationIcon} />}
          {position && <UpdateMapCenter position={position} />}
        </>
      </MapContainer>

      <button
        onClick={toggleTracking}
        className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        {tracking ? "Detener seguimiento" : "Activar ubicación"}
      </button>
    </div>
  );
}
