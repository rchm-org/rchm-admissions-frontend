import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token, ready } = useAuth();

  // ⛔ STOP router evaluation until auth is ready
  if (!ready) {
    return (
      <div className="p-6 text-center">
        Checking authentication…
      </div>
    );
  }

  // 🔐 Not authenticated → redirect ONCE
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Authenticated → render page
  return children;
};

export default ProtectedRoute;