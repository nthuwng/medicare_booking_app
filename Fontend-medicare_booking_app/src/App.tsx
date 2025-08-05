import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import AdminRoutes from "./routes/AdminRoutes";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/register";
import { useCurrentApp } from "./components/contexts/app.context";
import AdminProtectedRoute from "./components/auth/AdminProtectedRoute";
import NotFoundPage from "./components/common/error";
import DoctorProtectedRoute from "./components/auth/DoctorProtectedRoute";
import DoctorRoutes from "./routes/DoctorRoutes";
import ClientHeader from "./components/layout/ClientLayout/ClientHeader";
import ClientRoutes from "./routes/ClientRoutes";
import ClientFooter from "./components/layout/ClientLayout/ClientFooter";

function App() {
  const { user } = useCurrentApp();
  return (
    <Routes>
      {/* public */}
      <Route path="/" element={<ClientRoutes />} />

      {/* auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* admin */}
      <Route
        path="admin/*"
        element={
          <AdminProtectedRoute>
            <AdminRoutes />
          </AdminProtectedRoute>
        }
      />

      {/* doctor */}
      <Route
        path="doctor/*"
        element={
          <DoctorProtectedRoute>
            <DoctorRoutes />
          </DoctorProtectedRoute>
        }
      />

      {/* coding */}
      <Route path="code/*" element={<ClientFooter />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
