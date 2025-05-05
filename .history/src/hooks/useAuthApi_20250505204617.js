import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:4000/api";

export const useAuthApi = () => {
  const { login: setAuthContext } = useAuth();

  const register = async (username, password) => {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al registrarse");
    return data;
  };

  const login = async (username, password) => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Credenciales inválidas");

    setAuthContext(data.user);
    return data.user;
  };

  return { register, login };
};
