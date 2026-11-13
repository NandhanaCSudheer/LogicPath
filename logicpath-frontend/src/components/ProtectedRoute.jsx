import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#0c2945",
        color: "#b9d0e2",
        fontFamily: "sans-serif"
      }}>
        Loading LogicPath...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = (user?.role || "student").toLowerCase();
    const isAllowed = allowedRoles.map((r) => r.toLowerCase()).includes(userRole);
    if (!isAllowed) {
      // Redirect to their default dashboard based on role
      return <Navigate to={userRole === "teacher" ? "/teacher/dashboard" : "/student/dashboard"} replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
