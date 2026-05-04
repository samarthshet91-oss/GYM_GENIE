import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { token, authChecked } = useAuth();

  if (!authChecked) {
    return <div className="app-bg min-h-screen" />;
  }

  return token ? <Outlet /> : <Navigate to="/landing" replace />;
}
