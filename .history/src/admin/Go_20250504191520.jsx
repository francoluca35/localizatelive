import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Go() {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
      },
      (err) => {
        console.error("Error obteniendo ubicación", err);
      }
    );
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mapa en tiempo real</h1>
      {position ? (
        <MapContainer center={position} zoom={15} style={{ height: "500px" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          <Marker position={position}>
            <Popup>Estás aquí 🚶‍♂️</Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p>Obteniendo ubicación...</p>
      )}
    </div>
  );
}
