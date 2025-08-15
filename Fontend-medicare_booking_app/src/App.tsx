import { Route, Routes } from "react-router-dom";
import AdminRoutes from "./routes/AdminRoutes";

import { useCurrentApp } from "./components/contexts/app.context";
import AdminProtectedRoute from "./components/auth/AdminProtectedRoute";
import NotFoundPage from "./components/common/error";
import DoctorProtectedRoute from "./components/auth/DoctorProtectedRoute";
import DoctorRoutes from "./routes/DoctorRoutes";
import ClientRoutes from "./routes/ClientRoutes";
import LayoutDoctor from "./components/layout/DoctorLayout/layout.doctor";

function App() {
  const { user } = useCurrentApp();
  return (
    <Routes>
      {/* public */}
      <Route path="/*" element={<ClientRoutes />} />

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
      <Route path="code/*" element={<LayoutDoctor />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
