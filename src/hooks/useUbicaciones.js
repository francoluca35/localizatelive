import { useEffect, useState } from "react";

export default function useUbicaciones() {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarUbicaciones = async () => {
      setLoading(true);
      setError(null);

      try {
        const user = JSON.parse(localStorage.getItem("adminUser"));
        console.log("📌 Usuario obtenido del localStorage:", user?.username);

        if (!user?.username) {
          throw new Error("Usuario no encontrado en localStorage");
        }

        const res = await fetch(
          `http://localhost:4000/api/ubicaciones?usuarioLogeado=${user.username}`
        );

        if (!res.ok) {
          throw new Error("Error al obtener datos del servidor");
        }

        const data = await res.json();
        setUbicaciones(data.reverse());
      } catch (err) {
        console.error("❌ Error en useUbicaciones:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarUbicaciones();
  }, []);

  return { ubicaciones, loading, error };
}
