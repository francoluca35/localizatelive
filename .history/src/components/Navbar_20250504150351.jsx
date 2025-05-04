import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-white">LocalizaLive</h1>
      <div className="space-x-4">
        <Link to="/" className="text-white hover:text-blue-400">
          Inicio
        </Link>
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="text-white hover:text-blue-400">
              Login
            </Link>
            <Link to="/register" className="text-white hover:text-blue-400">
              Registro
            </Link>
          </>
        ) : (
          <>
            {user?.role === "admin" && (
              <Link to="/admin" className="text-white hover:text-blue-400">
                Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="text-white hover:text-red-400"
            >
              Salir
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
