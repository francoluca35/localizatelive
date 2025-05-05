import { useState } from "react";
import Map from "@pigeon-maps/react";

export default function Go() {
  const [position, setPosition] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);

  const toggleTracking = () => {
    if (!tracking) {
      const id = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (err) => {
          console.error("Error obteniendo ubicación:", err);
        },
        { enableHighAccuracy: true }
      );
      setWatchId(id);
      setTracking(true);
    } else {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setTracking(false);
      setPosition(null);
    }
  };

  return (
    <div className="relative w-screen h-screen">
      <Map
        center={position || [-34.6037, -58.3816]} // Buenos Aires por defecto
        zoom={15}
        height={window.innerHeight}
      >
        {position && (
          <div
            lat={position[0]}
            lng={position[1]}
            style={{
              width: 20,
              height: 20,
              backgroundColor: "red",
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </Map>

      <button
        onClick={toggleTracking}
        className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-green-700"
      >
        {tracking ? "Detener ubicación" : "Ver mi ubicación"}
      </button>
    </div>
  );
}
