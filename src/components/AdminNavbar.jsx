import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-white">Panel Admin</h1>
      <button onClick={handleLogout} className="text-white hover:text-red-400">
        Salir
      </button>
    </nav>
  );
}
