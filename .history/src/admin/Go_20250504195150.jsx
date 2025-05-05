import { useState, useEffect } from "react";
import { Map, Marker } from "pigeon-maps";

export default function Go() {
  const [coords, setCoords] = useState(null);
  const [watchId, setWatchId] = useState(null);

  const handleStartTracking = () => {
    if (!navigator.geolocation) {
      alert("La geolocalización no está soportada");
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.error("Error geolocalización:", err);
        alert("Error al obtener ubicación");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
      }
    );

    setWatchId(id);
  };

  const handleStopTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  useEffect(() => {
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Ubicación en tiempo real</h1>

      <div className="flex gap-4 mb-4">
        <button
          onClick={handleStartTracking}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Activar ubicación
        </button>
        <button
          onClick={handleStopTracking}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Detener ubicación
        </button>
      </div>

      <div className="h-[70vh] rounded overflow-hidden">
        <Map
          height={500}
          center={coords || [-34.6037, -58.3816]} // CABA por defecto
          defaultZoom={15}
        >
          {coords && <Marker width={50} anchor={[coords.lat, coords.lng]} />}
        </Map>
      </div>
    </div>
  );
}
