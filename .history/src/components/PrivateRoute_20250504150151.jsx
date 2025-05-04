import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, allowedRoles = [] }) {
  const userStr = localStorage.getItem("user");

  // Si no hay user guardado, redirige a login
  if (!userStr) return <Navigate to="/login" replace />;

  let user;
  try {
    user = JSON.parse(userStr);
  } catch (e) {
    // Si hay datos corruptos en localStorage, redirige a login
    return <Navigate to="/login" replace />;
  }

  // Si el rol no está permitido, redirige a home
  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Todo OK
  return children;
}
