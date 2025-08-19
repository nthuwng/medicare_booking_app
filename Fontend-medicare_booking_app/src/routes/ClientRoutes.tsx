import NotFoundPage from "@/components/common/error";
import LayoutClient from "@/components/layout/ClientLayout/layout.client";
import BookingPage from "@/modules/client/pages/BookingPage";
import ClinicBookingPage from "@/modules/client/pages/ClinicBookingPage";
import DoctorBookingPage from "@/modules/client/pages/DoctorBookingPage";
import DoctorDetailPage from "@/modules/client/pages/DoctorDetailPage";

import HomePage from "@/modules/client/pages/HomePage";
import SpecialtyBookingPage from "@/modules/client/pages/SpecialtyBookingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/register";
import { Route, Routes } from "react-router-dom";

const ClientRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LayoutClient />}>
        <Route index element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/booking" element={<BookingPage />} />
        <Route path="/booking/doctor/:doctorId" element={<DoctorDetailPage />} />
        <Route path="/booking/doctor" element={<DoctorBookingPage />} />
        <Route path="/booking/specialty" element={<SpecialtyBookingPage />} />
        <Route path="/booking/clinic" element={<ClinicBookingPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default ClientRoutes;
