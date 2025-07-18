import React, { useState } from "react";
import {
  AppstoreOutlined,
  TeamOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Users } from "lucide-react";
import { Layout, Menu, Dropdown, Space } from "antd";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import type { MenuProps } from "antd";
import { RiAdminFill } from "react-icons/ri";
import { FaUserDoctor } from 'react-icons/fa6';
import { AiOutlineUser } from "react-icons/ai";
type MenuItem = Required<MenuProps>["items"][number];

const { Content, Footer, Sider } = Layout;

const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const handleLogout = async () => {
    //todo
  };

  const items: MenuItem[] = [
    {
      label: <Link to="/admin">Dashboard</Link>,
      key: "dashboard",
      icon: <AppstoreOutlined style={{ fontSize: "20px" }} />,
    },
    {
      label: <span>Manage Users</span>,
      key: "user",
      icon: <Users size={20} />,
      children: [
        {
          label: <Link to="/admin/doctor">Doctor</Link>,
          key: "doctor",
          icon: <FaUserDoctor />,
        },
        {
          label: <Link to="/admin/admins">Admin</Link>,
          key: "admin",
          icon: <RiAdminFill />,
        },
      ],
    },
    {
      label: <Link to="/admin/specialities">Specialities</Link>,
      key: "specialities",
      icon: <AiOutlineUser size={20} />,
    },
  ];

  const itemsDropdown = [
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => alert("me")}>
          Quản lý tài khoản
        </label>
      ),
      key: "account",
    },
    {
      label: <Link to={"/"}>Trang chủ</Link>,
      key: "home",
    },
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
          Đăng xuất
        </label>
      ),
      key: "logout",
    },
  ];

  return (
    <>
      <Layout style={{ minHeight: "100vh" }} className="layout-admin">
        <Sider
          theme="light"
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div style={{ height: 32, margin: 16, textAlign: "center" }}>
            Medicare Booking App
          </div>
          <Menu
            defaultSelectedKeys={[activeMenu]}
            mode="inline"
            items={items}
            onClick={(e) => setActiveMenu(e.key)}
          />
        </Sider>
        <Layout>
          <div
            className="admin-header"
            style={{
              height: "50px",
              borderBottom: "1px solid #ebebeb",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 15px",
            }}
          >
            <span>
              {React.createElement(
                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  className: "trigger",
                  onClick: () => setCollapsed(!collapsed),
                }
              )}
            </span>
            <Dropdown menu={{ items: itemsDropdown }} trigger={["click"]}>
              <Space style={{ cursor: "pointer" }}>
                <RiAdminFill fontSize={20} />
              </Space>
            </Dropdown>
          </div>
          <Content style={{ padding: "15px" }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default LayoutAdmin;
