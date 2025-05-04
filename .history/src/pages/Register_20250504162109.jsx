import { useState } from "react";
import { useAuthApi } from "../hooks/useAuthApi";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuthApi();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, password);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-20 bg-gray-800 p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4">Crear cuenta</h2>
      {error && <p className="text-red-400 mb-2">{error}</p>}
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
        className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded"
      >
        Registrarme
      </button>
    </form>
  );
}
