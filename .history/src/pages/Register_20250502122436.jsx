import React from "react";

import { useState } from "react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Registro:", { username, password });
  };

  return (
    <form
      onSubmit={handleRegister}
      className="max-w-md mx-auto mt-20 bg-gray-800 p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4">Registrarse</h2>
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
        Registrarse
      </button>
    </form>
  );
}
