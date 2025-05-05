// src/admin/Go.jsx
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

function UpdateCenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 15);
    }
  }, [position, map]);
  return null;
}

export default function Go() {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    const watch = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
      },
      (err) => console.error("Error de geolocalización:", err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watch);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Localizate en Tiempo Real</h1>

      {position ? (
        <MapContainer
          center={position}
          zoom={15}
          style={{ height: "500px", width: "100%" }}
        >
          <UpdateCenter position={position} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={position}>
            <Popup>Estás aquí</Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p className="text-gray-300">Obteniendo ubicación...</p>
      )}
    </div>
  );
}
