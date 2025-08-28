import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");

  console.log("[ProtectedRoute] token?", !!token, "role:", role, "allowed:", allowedRoles);

  if (!token) {
    console.warn("[ProtectedRoute] No token, redirecting");
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    console.warn("[ProtectedRoute] Role mismatch", { role, allowedRoles });
    return <Navigate to="/" replace />;
  }

  console.log("[ProtectedRoute] Allowed → rendering");
  return element;
};

export default ProtectedRoute;
