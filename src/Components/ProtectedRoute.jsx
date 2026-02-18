import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const storedRole = localStorage.getItem("role");

  if (!storedRole) {
    return <Navigate to="/" replace />;
  }

  if (storedRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
