"use client";

import { Layout } from "antd";
import { ReactNode } from "react";
import EcommerceHeader from "../ecommerce/ecommerce-header";
import { Content } from "antd/es/layout/layout";
import Footer from "../Footer";

interface PublicLayoutProps {
  children: ReactNode;
}

const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <Layout>
      <EcommerceHeader />
      <Content>{children}</Content>
      <Footer />
    </Layout>
  );
};

export default PublicLayout;
