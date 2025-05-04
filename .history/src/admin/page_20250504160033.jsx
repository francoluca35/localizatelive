import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminNavbar />
      <div className="flex flex-col items-center justify-center mt-20 gap-6">
        <h1 className="text-3xl font-bold">Panel de administrador</h1>
        <p className="text-gray-300 mb-4">Contenido exclusivo para admin.</p>
        <div className="flex gap-4">
          <button
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg"
            onClick={() => navigate("/admin/go")}
          >
            LocalizateGo
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"
            onClick={() => navigate("/admin/history")}
          >
            HistoryLocalizate
          </button>
        </div>
      </div>
    </div>
  );
}
