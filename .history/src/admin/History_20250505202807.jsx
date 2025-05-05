import { useState } from "react";
import useUbicaciones from "../hooks/useUbicaciones";

export default function History() {
  const { ubicaciones, loading, error } = useUbicaciones();
  const [expandida, setExpandida] = useState(null);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Historial de Localizaciones</h2>

      {loading && <p className="text-gray-500">Cargando ubicaciones...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && ubicaciones.length === 0 && (
        <p className="text-gray-500">No hay ubicaciones guardadas.</p>
      )}

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
                onClick={() => setExpandida(expandida === index ? null : index)}
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
    </div>
  );
}
