"use client";

import React, { ReactNode, useState } from "react";
import {
  AppstoreOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  TeamOutlined,
  DollarOutlined,
  BarChartOutlined,
  SettingOutlined,
  TagsOutlined,
  InboxOutlined,
  LogoutOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button } from "antd";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "@/lib/auth-client";

const { Content, Footer, Sider } = Layout;

/* ====================== ROLE TYPE ====================== */
export type Role =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "OWNER"
  | "MANAGER"
  | "ACCOUNTANT"
  | "CLIENT";

/* ====================== MENU TYPE ====================== */
interface MenuModule {
  key: string;
  icon?: ReactNode;
  label: ReactNode;
  children?: MenuModule[];
}

/* ====================== ADMIN MODULES ====================== */
const adminModules: MenuModule[] = [
  {
    key: "dashboard",
    icon: <AppstoreOutlined />,
    label: <Link href="/admin/dashboard">Dashboard</Link>,
  },
  {
    key: "orders",
    icon: <ShoppingCartOutlined />,
    label: <Link href="/admin/orders">Orders</Link>,
  },
  {
    key: "products",
    icon: <InboxOutlined />,
    label: <Link href="/admin/products">Products</Link>,
  },

  {
    key: "categories",
    icon: <InboxOutlined />,
    label: <Link href="/admin/categories">Categories</Link>,
  },
  {
    key: "customers",
    icon: <TeamOutlined />,
    label: <Link href="/admin/users">Customers</Link>,
  },

  {
    key: "settings",
    icon: <SettingOutlined />,
    label: <Link href="/admin/profile">profile</Link>,
  },
];

/* ====================== CLIENT MODULE ====================== */
const clientModules: MenuModule[] = [
  {
    key: "my-orders",
    icon: <ShoppingCartOutlined />,
    label: <Link href="/orders">Orders</Link>,
  },
  {
    key: "my-carts",
    icon: <ShoppingCartOutlined />,
    label: <Link href="/orders">Carts</Link>,
  },
  {
    key: "profile",
    icon: <UserOutlined />,
    label: <Link href="/profile">Profile</Link>,
  },
];

/* ====================== ROLE ACCESS ====================== */
const roleModuleAccess: Record<Role, string[]> = {
  SUPER_ADMIN: adminModules.map((m) => m.key),

  ADMIN: [
    "dashboard",
    "orders",
    "products",
    "categories",
    "customers",
    "inventory",
    "reports",
    "users",
    "settings",
  ],

  OWNER: [
    "dashboard",
    "orders",
    "products",
    "categories",
    "customers",
    "inventory",
    "reports",
    "users",
  ],

  MANAGER: [
    "dashboard",
    "orders",
    "products",
    "customers",
    "inventory",
    "reports",
  ],

  ACCOUNTANT: ["dashboard", "orders", "transactions", "reports"],

  CLIENT: ["my-orders", "my-carts", "profile"],
};

/* ====================== PATH TO KEY ====================== */
const pathToKey: Record<string, string> = {
  "/dashboard": "dashboard",
  "/orders": "orders",
  "/products": "products",
  "/categories": "categories",
  "/customers": "customers",
  "/inventory": "inventory",
  "/transactions": "transactions",
  "/reports": "reports",
  "/users": "users",
  "/settings": "settings",
  "/my-orders": "my-orders",
  "/my-carts": "my-carts",
  "/profile": "profile",
};

/* ====================== LAYOUT ====================== */
const PrivateLayout: React.FC<{ roles?: Role[]; children: ReactNode }> = ({
  roles = ["CLIENT"],
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const allowedKeys = Array.from(
    new Set(roles.flatMap((r) => roleModuleAccess[r] || [])),
  );

  const isClientOnly = roles.length === 1 && roles.includes("CLIENT");

  const modules = isClientOnly ? clientModules : adminModules;

  const visibleModules = modules.filter((m) => allowedKeys.includes(m.key));

  const siderWidth = collapsed ? 80 : 200;

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          window.location.reload();
        },
      },
    });
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={200}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          height: "100vh",
          backgroundColor: "#fff",
          borderRight: "1px solid #f0f0f0",
        }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid #f0f0f0",
            fontWeight: 600,
          }}
        >
          Royal Import Admin
        </div>

        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[
            pathToKey[pathname] || (isClientOnly ? "my-orders" : "dashboard"),
          ]}
          items={visibleModules}
        />

        <div style={{ padding: 12 }}>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ width: "100%" }}
          >
            {!collapsed && "Logout"}
          </Button>
        </div>
      </Sider>

      <Layout style={{ marginLeft: siderWidth, transition: "0.2s" }}>
        <Content
          style={{
            margin: "24px 16px",
            background: "#fff",
            padding: 24,
          }}
        >
          {children}
        </Content>

        <Footer style={{ textAlign: "center" }}>MyStore © 2026</Footer>
      </Layout>
    </Layout>
  );
};

export default PrivateLayout;
