import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { App as AntdApp } from "antd";

import { BrowserRouter } from "react-router-dom";
import "./styles/global.css";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AntdApp>
        <ConfigProvider locale={viVN}>
          <App />
        </ConfigProvider>
      </AntdApp>
    </BrowserRouter>
  </StrictMode>
);
