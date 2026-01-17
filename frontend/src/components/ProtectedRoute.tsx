import { Navigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute = ({
  children,
  requiredRole,
}: ProtectedRouteProps) => {
  const { user, token } = useUserStore();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Compare roles in lowercase
  if (requiredRole && user.role.toLowerCase() !== requiredRole.toLowerCase()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
