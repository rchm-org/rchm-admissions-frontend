import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Admission from "./pages/Admission";
import AdminAdmissions from "./pages/AdminAdmissions";
import "./index.css";
import Home from "./pages/Home";



import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public route */}
           <Route path="/" element={<Home />} />
          <Route path="/admission" element={<Admission />} />

          {/* Protected admin route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminAdmissions />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
