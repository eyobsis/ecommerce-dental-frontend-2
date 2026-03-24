import "./globals.css";

import PrivateLayout, { Role } from "@/components/layout/private-layout";
import PublicLayout from "@/components/layout/public-layout";
import UserProvider from "@/hooks/session-context";
import { auth } from "@/lib/auth";
import { cookies, headers } from "next/headers";
import AuthPage from "./auth/page";
import { ReactQueryProvider } from "@/components/provider/react-query-provider";
import { Toaster } from "sonner";
import { ToastContainer } from "react-toastify";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const publicPaths = [
    "/privacy",
    "/",
    "/",
    "/cart",
    "/auth",
    "/auth/new",
    "/products",
    "/products/*",
  ];

  const isPublic = publicPaths.includes(pathname);
  console.log("Resolved pathname:", pathname);

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  // if (session && publicPaths.includes(pathname)) {
  //   redirect("/");
  // }

  if (session && session?.user?.accountType === "ADMIN" && pathname === "/") {
    redirect("/admin/dashboard");
  }
  return (
    <html>
      <body>
        <ReactQueryProvider>
          <UserProvider session={session}>
            {session && session?.user?.accountType !== "CLIENT" ? (
              <PrivateLayout roles={[session?.user?.accountType as Role]}>
                {children}
              </PrivateLayout>
            ) : session && session?.user?.accountType === "CLIENT" ? (
              <PublicLayout>{children}</PublicLayout>
            ) : isPublic ? (
              <PublicLayout>{children}</PublicLayout>
            ) : (
              <PublicLayout>{children}</PublicLayout>

              // <AuthPage />
            )}
          </UserProvider>
        </ReactQueryProvider>
        <Toaster />
        <ToastContainer />
      </body>
    </html>
  );
}
