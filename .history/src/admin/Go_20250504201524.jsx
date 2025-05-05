import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import customIcon from "/Assets/location-icon.png"; // tu ícono personalizado

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
  const [activo, setActivo] = useState(false);

  useEffect(() => {
    let watchId;

    if (activo) {
      watchId = navigator.geolocation.watchPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const now = new Date().toLocaleString("es-AR");

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await res.json();

            const address = data.address;
            const city =
              address.city ||
              address.town ||
              address.village ||
              address.hamlet ||
              address.suburb ||
              address.county ||
              address.state_district ||
              address.state ||
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
    }

    return () => navigator.geolocation.clearWatch(watchId);
  }, [activo]);

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
            <Marker position={position} icon={customIcon}>
              <Popup>Estás acá</Popup>
            </Marker>
            <MoverMapa position={position} />
          </>
        )}
      </MapContainer>

      <div className="absolute top-4 right-4 bg-white bg-opacity-90 text-black p-4 rounded-lg shadow-md w-64 text-sm z-10">
        {!activo ? (
          <button
            onClick={() => setActivo(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mb-2"
          >
            Activar ubicación
          </button>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
