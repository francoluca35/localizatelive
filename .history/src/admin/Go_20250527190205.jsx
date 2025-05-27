"use client";
import { useEffect, useRef, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const defaultCenter = {
  lat: -34.6,
  lng: -58.38,
};

export default function Go() {
  const [position, setPosition] = useState(null);
  const [info, setInfo] = useState({
    lat: "",
    lon: "",
    city: "",
    address: "",
    time: "",
    username: "",
    houseNumber: "",
  });
  const [activo, setActivo] = useState(
    () => localStorage.getItem("ubicacionActiva") === "true"
  );
  const intervalRef = useRef(null);
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const guardarUbicacion = async () => {
    if (!info.lat || !info.lon) return;

    const usuario = JSON.parse(localStorage.getItem("adminUser"));

    try {
      await axios.post("http://localhost:4000/api/ubicaciones", {
        lat: info.lat,
        lon: info.lon,
        city: info.city,
        address: info.address,
        houseNumber: info.houseNumber,
        time: info.time,
        usuarioLogeado: usuario?.username || "desconocido",
      });

      console.log("Ubicación guardada");
    } catch (err) {
      console.error("Error al guardar ubicación:", err);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("adminUser"));

    if (activo && user?.username) {
      const watchId = navigator.geolocation.watchPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const now = new Date().toLocaleString("es-AR");

          try {
            const res = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
            );
            const data = await res.json();

            if (!data.results || data.results.length === 0)
              throw new Error("No se encontraron resultados");

            const result = data.results[0];
            const components = result.address_components;

            const getComponent = (type) =>
              components.find((c) => c.types.includes(type))?.long_name || "";

            const numeroCasa =
              getComponent("street_number") ||
              result.formatted_address.match(/\b\d{1,5}\b/)?.[0] ||
              "";

            const ciudad =
              getComponent("locality") ||
              getComponent("administrative_area_level_2") ||
              getComponent("administrative_area_level_1") ||
              "Desconocido";

            const direccionCompleta = result.formatted_address;

            const nuevaInfo = {
              lat: latitude.toFixed(6),
              lon: longitude.toFixed(6),
              city: ciudad,
              address: direccionCompleta,
              time: now,
              username: user.username,
              houseNumber: numeroCasa,
            };

            setPosition({ lat: latitude, lng: longitude });
            setInfo(nuevaInfo);

            if (mapRef.current) {
              mapRef.current.panTo({ lat: latitude, lng: longitude });
            }
          } catch (err) {
            console.error("Error obteniendo dirección:", err);
          }
        },
        (err) => {
          console.error("Error geolocalización:", err);
          alert("No se pudo acceder a tu ubicación.");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );

      intervalRef.current = setInterval(() => {
        guardarUbicacion();
      }, 30 * 60 * 1000); // cada 30 minutos

      return () => {
        navigator.geolocation.clearWatch(watchId);
        clearInterval(intervalRef.current);
      };
    }
  }, [activo]);

  const activarUbicacion = () => {
    setActivo(true);
    localStorage.setItem("ubicacionActiva", "true");
  };

  const desactivarUbicacion = () => {
    setActivo(false);
    localStorage.setItem("ubicacionActiva", "false");
    setPosition(null);
    setInfo({
      lat: "",
      lon: "",
      city: "",
      address: "",
      time: "",
      username: "",
      houseNumber: "",
    });
    clearInterval(intervalRef.current);
  };

  if (!isLoaded) return <div className="text-white p-6">Cargando mapa...</div>;

  return (
    <div className="relative h-screen">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position || defaultCenter}
        zoom={15}
        onLoad={(map) => (mapRef.current = map)}
      >
        {position && <Marker position={position} />}
      </GoogleMap>

      <div className="absolute top-4 right-4 bg-white/90 text-black p-4 rounded-lg shadow-lg w-80 text-sm z-10">
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
              <strong>Número de casa:</strong>{" "}
              {info.houseNumber || "No disponible"}
            </p>
            <p>
              <strong>Fecha/Hora:</strong> {info.time}
            </p>
            <p>
              <strong>Usuario:</strong> {info.username}
            </p>

            <div className="flex flex-col gap-2 mt-3">
              <button
                onClick={guardarUbicacion}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
              >
                Guardar manualmente
              </button>
              <button
                onClick={desactivarUbicacion}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
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
