import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Error desconocido");
        return;
      }

      const data = await response.json();
      login(data.user, data.token); // guarda en contexto
      console.log("✅ Usuario logueado:", data.user);

      // Redirección según rol
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Error de red:", err);
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-md mx-auto mt-20 bg-gray-800 p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4">Iniciar sesión</h2>

      {error && (
        <p className="bg-red-600 text-white p-2 rounded mb-4">{error}</p>
      )}

      <input
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 mb-4 bg-gray-700 rounded text-white"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-4 bg-gray-700 rounded text-white"
      />
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
      >
        Entrar
      </button>
    </form>
  );
}
