import { Outlet } from "react-router-dom";
import ClientHeader from "./ClientHeader";
import ClientFooter from "./ClientFooter";

const LayoutClient = () => {
  return (
    <>
      <ClientHeader />
      <Outlet />
      <ClientFooter />
    </>
  );
};

export default LayoutClient;
