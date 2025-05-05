import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { FaMapMarkerAlt } from "react-icons/fa";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

function MoverMapa({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 15);
  }, [position, map]);
  return null;
}

const CustomMarkerIcon = () =>
  L.divIcon({
    className: "custom-icon",
    html: `<div style="color:red; font-size: 32px;">📍</div>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
  });

export default function Go() {
  const [position, setPosition] = useState(null);
  const [info, setInfo] = useState({
    lat: "",
    lon: "",
    city: "",
    address: "",
    time: "",
  });
  const [activo, setActivo] = useState(
    () => localStorage.getItem("ubicacionActiva") === "true"
  );
  const intervalRef = useRef(null);

  const guardarUbicacion = async () => {
    if (!info.lat || !info.lon) return;

    const user = JSON.parse(localStorage.getItem("adminUser"));

    try {
      await axios.post("http://localhost:4000/api/ubicaciones", {
        lat: info.lat,
        lon: info.lon,
        city: info.city,
        address: info.address,
        time: info.time,
        username: user?.username || "desconocido", // <--- este campo debería llegar al backend
      });

      console.log("Ubicación guardada");
    } catch (err) {
      console.error("Error al guardar ubicación:", err);
    }
  };

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

            const calle =
              address.road && address.house_number
                ? `${address.road} ${address.house_number}`
                : address.road ||
                  address.neighbourhood ||
                  address.suburb ||
                  address.village ||
                  address.city ||
                  "Desconocido";

            const ciudad =
              address.city ||
              address.town ||
              address.village ||
              address.municipality ||
              address.county ||
              address.state_district ||
              address.state ||
              "Desconocido";

            const direccionCompleta =
              calle !== "Desconocido"
                ? `${calle}, ${ciudad}`
                : data.display_name;

            const user = JSON.parse(localStorage.getItem("adminUser"));

            const nuevaInfo = {
              lat: latitude.toFixed(6),
              lon: longitude.toFixed(6),
              city: ciudad,
              address: direccionCompleta,
              time: now,
            };

            setPosition([latitude, longitude]);
            setInfo(nuevaInfo);
          } catch (err) {
            console.error("Error obteniendo dirección:", err);
          }
        },
        (err) => {
          console.error("Error al obtener ubicación:", err);
          alert("No se pudo acceder a tu ubicación.");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );

      intervalRef.current = setInterval(() => {
        guardarUbicacion();
      }, 30 * 60 * 1000); // cada 30 minutos
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activo]);

  const activarUbicacion = () => {
    setActivo(true);
    localStorage.setItem("ubicacionActiva", "true");
  };

  const desactivarUbicacion = () => {
    setActivo(false);
    localStorage.setItem("ubicacionActiva", "false");
    setPosition(null);
    setInfo({ lat: "", lon: "", city: "", address: "", time: "" });
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

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
            <Marker position={position} icon={CustomMarkerIcon()}>
              <Popup>Estás acá</Popup>
            </Marker>
            <MoverMapa position={position} />
          </>
        )}
      </MapContainer>

      <div className="absolute top-4 right-4 bg-white bg-opacity-90 text-black p-4 rounded-lg shadow-md w-72 text-sm z-10">
        {!activo ? (
          <button
            onClick={activarUbicacion}
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
              <strong>Dirección:</strong> {info.address}
            </p>
            <p>
              <strong>Fecha/Hora:</strong> {info.time}
            </p>
            <p>
              <strong>Usuario:</strong> {info.username}
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={guardarUbicacion}
                className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded"
              >
                Guardar manualmente
              </button>
              <button
                onClick={desactivarUbicacion}
                className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded"
              >
                Desactivar ubicación
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
