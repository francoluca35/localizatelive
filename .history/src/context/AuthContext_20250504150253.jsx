import { createContext, useContext, useEffect, useState } from "react";

// Crear el contexto
const AuthContext = createContext();

// Hook para acceder fácil
export const useAuth = () => useContext(AuthContext);

// Proveedor
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Leer de localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
