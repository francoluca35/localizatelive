"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

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
import L from "leaflet";

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
      const res = await fetch("/api/ubicaciones");
      const data = await res.json();
      setUbicaciones(data);
    };
    cargar();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Historial de Localizaciones</h2>
      <table className="w-full table-auto text-sm bg-white text-black shadow rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Fecha/Hora</th>
            <th className="p-2">Localidad</th>
            <th className="p-2">Latitud</th>
            <th className="p-2">Longitud</th>
            <th className="p-2">Ver</th>
          </tr>
        </thead>
        <tbody>
          {ubicaciones.map((ubi, index) => (
            <tr key={index} className="border-t">
              <td className="p-2">{ubi.time}</td>
              <td className="p-2">{ubi.city}</td>
              <td className="p-2">{ubi.lat}</td>
              <td className="p-2">{ubi.lon}</td>
              <td className="p-2">
                <button
                  className="bg-blue-600 text-white px-2 py-1 rounded"
                  onClick={() =>
                    setExpandida(index === expandida ? null : index)
                  }
                >
                  {expandida === index ? "Ocultar" : "Ver"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {expandida !== null && (
        <div className="mt-4 h-[300px] border rounded overflow-hidden">
          <MapContainer
            center={[
              parseFloat(ubicaciones[expandida].lat),
              parseFloat(ubicaciones[expandida].lon),
            ]}
            zoom={15}
            className="w-full h-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker
              position={[
                parseFloat(ubicaciones[expandida].lat),
                parseFloat(ubicaciones[expandida].lon),
              ]}
              icon={icon}
            />
          </MapContainer>
        </div>
      )}
    </div>
  );
}
