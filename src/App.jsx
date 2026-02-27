import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Admission from "./pages/Admission";
import AdminAdmissions from "./pages/AdminAdmissions";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admission" element={<Admission />} />

          {/* Admin — protected */}
          <Route
            path="/admin/admissions"
            element={
              <ProtectedRoute>
                <AdminAdmissions />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<h1 className="p-6 text-2xl">404 — Page Not Found</h1>} />
        </Routes>

        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;