import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Ícono de ubicación personalizado como el que mostraste
const locationIcon = new L.Icon({
  iconUrl: "/location-icon.png", // guardá tu pin rojo en public/ como location-icon.png
  iconSize: [35, 45],
  iconAnchor: [17, 45],
});

function UpdateMapCenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 17); // más zoom para vista satelital
    }
  }, [position, map]);
  return null;
}

export default function Go() {
  const [position, setPosition] = useState(null);
  const [watching, setWatching] = useState(false);
  const [watchId, setWatchId] = useState(null);

  const startTracking = () => {
    if (!watching) {
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
      setWatching(true);
    }
  };

  const stopTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatching(false);
    }
  };

  return (
    <div className="relative h-screen w-full">
      <MapContainer center={[-34.6, -58.4]} zoom={15} className="h-full w-full">
        <TileLayer
          // Estilo tipo satélite (Mapbox style o alternativo gratuito)
          url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenMapTiles & contributors"
        />
        {position && (
          <>
            <Marker position={position} icon={locationIcon} />
            <UpdateMapCenter position={position} />
          </>
        )}
      </MapContainer>

      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[999]">
        {!watching ? (
          <button
            onClick={startTracking}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow"
          >
            Activar ubicación
          </button>
        ) : (
          <button
            onClick={stopTracking}
            className="bg-red-600 text-white px-4 py-2 rounded shadow"
          >
            Desactivar ubicación
          </button>
        )}
      </div>
    </div>
  );
}
