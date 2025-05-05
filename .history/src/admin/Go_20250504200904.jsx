import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Componente para mover el mapa
function MoverMapa({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 15);
  }, [position, map]);
  return null;
}

export default function Go() {
  const [position, setPosition] = useState(null);
  const [info, setInfo] = useState({
    lat: "",
    lon: "",
    city: "",
    time: "",
  });

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const now = new Date().toLocaleString("es-AR");

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "Desconocido";

          setPosition([latitude, longitude]);
          setInfo({
            lat: latitude.toFixed(6),
            lon: longitude.toFixed(6),
            city,
            time: now,
          });
        } catch (err) {
          console.error("Error obteniendo ciudad:", err);
        }
      },
      (err) => {
        console.error("Error al obtener ubicación:", err);
        alert("No se pudo acceder a tu ubicación.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div className="h-screen relative">
      <MapContainer
        center={[-34.6, -58.38]}
        zoom={13}
        scrollWheelZoom
        className="h-full w-full z-0"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {position && (
          <>
            <Marker position={position}>
              <Popup>Estás acá</Popup>
            </Marker>
            <MoverMapa position={position} />
          </>
        )}
      </MapContainer>

      <div className="absolute top-4 right-4 bg-white bg-opacity-90 text-black p-4 rounded-lg shadow-md w-64 text-sm z-10">
        <p>
          <strong>Latitud:</strong> {info.lat}
        </p>
        <p>
          <strong>Longitud:</strong> {info.lon}
        </p>
        <p>
          <strong>Localidad:</strong> {info.city}
        </p>
        <p>
          <strong>Fecha/Hora:</strong> {info.time}
        </p>
      </div>
    </div>
  );
}
