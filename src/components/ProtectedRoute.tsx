import { useUserContext } from "../context/userContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  const { user } = useUserContext();
  const location = useLocation();
  if (user) {
    return <Outlet />;
  }
  return <Navigate to="/login" state={{ from: location }} replace />;
}
