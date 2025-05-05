import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Icono personalizado para marcador
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
    const cargarUbicaciones = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/ubicaciones");
        const data = await res.json();
        setUbicaciones(data.reverse()); // mostrar lo más reciente arriba
      } catch (error) {
        console.error("Error al cargar ubicaciones:", error);
      }
    };
    cargarUbicaciones();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Historial de Localizaciones</h2>

      {ubicaciones.length === 0 ? (
        <p className="text-gray-500">No hay ubicaciones guardadas todavía.</p>
      ) : (
        <div className="space-y-4">
          {ubicaciones.map((ubi, index) => (
            <div
              key={index}
              className="bg-white text-black shadow p-4 rounded-md"
            >
              <div className="flex justify-between">
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
                  className="bg-blue-600 text-white h-fit px-3 py-1 rounded hover:bg-blue-700"
                >
                  {expandida === index ? "Ocultar mapa" : "Ver mapa"}
                </button>
              </div>

              {expandida === index && (
                <div className="mt-4 h-[250px] border rounded overflow-hidden">
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
