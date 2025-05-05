"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Importaciones dinámicas para evitar errores con SSR
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

// Ícono personalizado
const icon = L.divIcon({
  className: "",
  html: `<div style="color:red;font-size:24px;">📍</div>`,
  iconSize: [30, 42],
  iconAnchor: [15, 42],
});

export default function History() {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [expandida, setExpandida] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/ubicaciones");
        const data = await res.json();
        setUbicaciones(data.reverse()); // lo más reciente primero
      } catch (err) {
        console.error("Error cargando ubicaciones:", err);
      }
    };
    cargar();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Historial de Localizaciones</h2>

      {ubicaciones.length === 0 ? (
        <p className="text-gray-500">Aún no se registraron ubicaciones.</p>
      ) : (
        <div className="space-y-4">
          {ubicaciones.map((ubi, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-4 text-black"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p>
                    <strong>Fecha/Hora:</strong> {ubi.time}
                  </p>
                  <p>
                    <strong>Latitud:</strong> {ubi.lat}
                  </p>
                  <p>
                    <strong>Longitud:</strong> {ubi.lon}
                  </p>
                  <p>
                    <strong>Localidad:</strong> {ubi.city}
                  </p>
                  <p>
                    <strong>Dirección:</strong> {ubi.address}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setExpandida(expandida === index ? null : index)
                  }
                  className="ml-4 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  {expandida === index ? "Ocultar mapa" : "Ver mapa"}
                </button>
              </div>

              {expandida === index && (
                <div className="mt-4 h-[250px] rounded overflow-hidden border">
                  <MapContainer
                    center={[parseFloat(ubi.lat), parseFloat(ubi.lon)]}
                    zoom={15}
                    className="w-full h-full"
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker
                      position={[parseFloat(ubi.lat), parseFloat(ubi.lon)]}
                      icon={icon}
                    />
                  </MapContainer>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
