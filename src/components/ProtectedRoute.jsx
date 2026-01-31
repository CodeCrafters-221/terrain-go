import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) return <Navigate to="/" />;

  return children;
}
