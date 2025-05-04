import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulación de login (si quisieras, podés validar aquí)
    localStorage.setItem("user", JSON.stringify({ username, role: "admin" }));

    // Redirige al dashboard
    navigate("/admin");
  };

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-md mx-auto mt-20 bg-gray-800 p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4">Iniciar sesión</h2>
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
