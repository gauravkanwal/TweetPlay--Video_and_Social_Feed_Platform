import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PrivateRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="text-black text-center py-20">Loading...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default PrivateRoute;
