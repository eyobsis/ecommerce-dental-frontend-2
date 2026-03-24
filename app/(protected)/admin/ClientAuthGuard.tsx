"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const rolePermissions: Record<string, string[]> = {
  ADMIN: ["*"],
  OWNER: ["*"],
  MANAGER: [
    "/admin/orders",
    "/admin/designer",
    "/admin/client-credentials",
    "/admin/products",
    "/admin/profile",
  ],
  RECEPTION: ["/admin/orders", "/admin/client-credentials", "/admin/profile"],
  SCANNER: ["/admin/orders", "/admin/designer", "/admin/profile"],
  ACCOUNTANT: ["/admin/client-credentials", "/admin/profile"],
  STAINER: ["/admin/orders", "/admin/profile"],
  MILLER: ["/admin/orders", "/admin/profile"],
};

type Props = {
  role: string;
  children: React.ReactNode;
};

export default function ClientAuthGuard({ role, children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null); // null = checking

  useEffect(() => {
    const cleanPath = pathname.toLowerCase().replace(/\/$/, "");

    const allowedPaths = rolePermissions[role] || [];

    const allowed =
      allowedPaths.includes("*") ||
      allowedPaths.some((allowed) => cleanPath.startsWith(allowed.toLowerCase()));

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAllowed(allowed);

    if (!allowed) {
      router.replace("/"); // or "/unauthorized" if you have one
    }
  }, [pathname, role, router]);


  if (isAllowed === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  // If not allowed → we already triggered redirect, but render nothing just in case
  if (!isAllowed) {
    return null;
  }

  // Only render children if explicitly allowed
  return <>{children}</>;
}

