import { Route, Routes } from "react-router-dom";
import NotFoundPage from "@/components/common/error";
import LayoutDoctor from "@/components/layout/DoctorLayout/layout.doctor";
import DoctorDashboardPage from "@/modules/doctor/pages/DoctorDashboardPage";
import DoctorProFilePage from "@/modules/doctor/pages/DoctorProFileManagePage";
import DoctorProFileManagePage from "@/modules/doctor/pages/DoctorProFileManagePage";

const DoctorRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LayoutDoctor />}>
        <Route index element={<DoctorDashboardPage />} />
        <Route path="profile-settings" element={<DoctorProFileManagePage />} />
        {/*<Route path="specialities" element={<SpecialitiesManagementPage />} />
        <Route path="clinic" element={<ClinicManagementPage />} /> */}
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default DoctorRoutes;
