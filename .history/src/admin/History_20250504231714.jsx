import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const icon = L.divIcon({
  className: "",
  html: `<div style="color:red;font-size:24px;">📍</div>`,
  iconSize: [30, 42],
  iconAnchor: [15, 42],
});

export default function History() {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [mostrarMapa, setMostrarMapa] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      const user = JSON.parse(localStorage.getItem("adminUser"));
      if (!user || !user.username) return;

      try {
        const res = await fetch(
          `http://localhost:4000/api/ubicaciones?usuarioLogeado=${user.username}`
        );
        const data = await res.json();
        setUbicaciones(data);
      } catch (error) {
        console.error("Error al cargar historial:", error);
      }
    };
    cargar();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Historial de Localizaciones</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ubicaciones.map((ubi, index) => (
          <div key={index} className="bg-white text-black shadow p-4 rounded">
            <p>
              <strong>Fecha/Hora:</strong> {ubi.time}
            </p>
            <p>
              <strong>Localidad:</strong> {ubi.city}
            </p>
            <p>
              <strong>Dirección:</strong> {ubi.address}
            </p>
            <p>
              <strong>Lat/Lon:</strong> {ubi.lat}, {ubi.lon}
            </p>
            <button
              className="bg-blue-600 mt-2 px-3 py-1 text-white rounded"
              onClick={() =>
                setMostrarMapa(index === mostrarMapa ? null : index)
              }
            >
              {mostrarMapa === index ? "Ocultar Mapa" : "Ver Mapa"}
            </button>
            {mostrarMapa === index && (
              <div className="h-[250px] mt-2 rounded overflow-hidden">
                <MapContainer
                  center={[parseFloat(ubi.lat), parseFloat(ubi.lon)]}
                  zoom={15}
                  className="h-full w-full"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker
                    position={[parseFloat(ubi.lat), parseFloat(ubi.lon)]}
                    icon={icon}
                  >
                    <Popup>Ubicación guardada</Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
