import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Lock history
    window.history.pushState(null, "", window.location.href);

    const handleBack = () => {
      setShowWarning(true);
      // Re-push so user stays on page
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, []);

  const handleLogout = () => {
    setShowWarning(false);
    logout();
    navigate("/login", { replace: true });
  };

  const handleStay = () => {
    setShowWarning(false);
  };

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {children}

      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={handleStay}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fadeInUp">
            <h2 className="text-lg font-semibold text-slate-900">
              Security Warning
            </h2>

            <p className="text-sm text-slate-600 mt-2">
              Leaving the admin dashboard requires re-authentication.
              This helps keep sensitive data secure.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleStay}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
              >
                Stay
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Re-login
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
