// components/PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Adjust path if needed
import Unauthorized from "./components/Unauthorized";

interface PrivateRouteProps {
  children: React.ReactElement;
  allowedRoles: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user } = useAuth();
  const role = user?.role;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Unauthorized />;
  }

  return children;
};

export default PrivateRoute;
