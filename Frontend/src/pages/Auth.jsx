import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AuthForm from "../components/AuthForm";

function Auth() {
  const { user } = useAuth();

  // if already logged in → go home
  if (user) return <Navigate to="/" replace />;

  return <AuthForm />;
}

export default Auth;