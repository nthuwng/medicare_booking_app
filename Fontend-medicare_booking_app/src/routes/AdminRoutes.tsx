import React from "react";
import LayoutAdmin from "../components/layout/AdminLayout/layout.admin";
import { Route, Routes } from "react-router-dom";
import AdminDashboardPage from "../modules/admin/pages/AdminDashboardPage";
import DoctorManagementPage from "../modules/admin/pages/DoctorManagementPage";
import SpecialitiesManagementPage from "../modules/admin/pages/SpecialitiesManagementPage";
import NotFoundPage from "@/components/common/error";
import ClinicManagementPage from "@/modules/admin/pages/ClinicManagementPage";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LayoutAdmin />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="doctor" element={<DoctorManagementPage />} />
        <Route path="specialities" element={<SpecialitiesManagementPage />} />
        <Route path="clinic" element={<ClinicManagementPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AdminRoutes;
