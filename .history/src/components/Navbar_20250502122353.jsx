import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-white">LocalizaLive</h1>
      <div className="space-x-4">
        <Link to="/" className="text-white hover:text-blue-400">
          Inicio
        </Link>
        <Link to="/login" className="text-white hover:text-blue-400">
          Login
        </Link>
        <Link to="/register" className="text-white hover:text-blue-400">
          Registro
        </Link>
      </div>
    </nav>
  );
}
