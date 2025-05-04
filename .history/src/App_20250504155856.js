import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPage from "./admin/page";
import AdminHistory from "./admin/History";
import AdminGo from "./admin/Go";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

function Layout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/history"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminHistory />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/go"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminGo />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Layout />
      </div>
    </Router>
  );
}
