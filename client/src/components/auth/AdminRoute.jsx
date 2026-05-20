import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

function AdminRoute() {
  const { user, isBootstrapping, isAuthenticated } = useAuth();

  if (isBootstrapping) {
    return <p className="text-sm text-slate-600 dark:text-slate-300">Checking admin access...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;
