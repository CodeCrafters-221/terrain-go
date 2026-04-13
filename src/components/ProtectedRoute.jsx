import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, profile, loading, profileLoading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;

  // Si on a besoin d'un rôle spécifique, on attend que le profil soit chargé
  if (allowedRoles && profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  // Vérification des rôles
  if (allowedRoles) {
    if (!profile || !allowedRoles.includes(profile.role)) {
      return <Navigate to="/" />;
    }
  }

  return children;
}
