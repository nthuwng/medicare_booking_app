import NotFoundPage from "@/components/common/error";
import LayoutClient from "@/components/layout/ClientLayout/layout.client";
import HomePage from "@/modules/client/pages/HomePage";
import { Route, Routes } from "react-router-dom";

const ClientRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LayoutClient />}>
        <Route index element={<HomePage />} />
        {/* <Route path="admin-management" element={<AdminManagementPage />} /> */}
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default ClientRoutes;
