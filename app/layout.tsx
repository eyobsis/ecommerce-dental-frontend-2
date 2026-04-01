import "./globals.css";

import { Geist } from "next/font/google";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { ToastContainer } from "react-toastify";

import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import UserProvider from "@/hooks/session-context";
import { ReactQueryProvider } from "@/components/provider/react-query-provider";

import PrivateLayout, { Role } from "@/components/layout/private-layout";
import PublicLayout from "@/components/layout/public-layout";

// Load Google Font
const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Fetch Request Headers & Session
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  
  // Custom middleware header to get current route path
  const pathname = headersList.get("x-pathname") || "";
  const user = session?.user;

  // 2. Auth Redirects
  // If an Admin/Manager hits the root homepage, push them to the dashboard
  if (user && user.accountType !== "CLIENT" && pathname === "/") {
    redirect("/admin/dashboard");
  }

  // 3. Layout Selection Logic
  // Any logged-in staff member gets the Private Layout.
  // Everyone else (Clients, Guests, Logged-out users) gets the Public Layout.
  const isStaffMember = user && user.accountType !== "CLIENT";

  return (
    <html lang="en" className={cn("font-sans antialiased", geist.variable)}>
      <body>
        <ReactQueryProvider>
          <UserProvider session={session}>
            
            {/* Conditional Layout Injection */}
            {isStaffMember ? (
              <PrivateLayout roles={[user.accountType as Role]}>
                {children}
              </PrivateLayout>
            ) : (
              <PublicLayout>
                {children}
              </PublicLayout>
            )}

          </UserProvider>
        </ReactQueryProvider>

        {/* Global Toast Notifications */}
        <Toaster richColors position="top-right" />
        <ToastContainer />
      </body>
    </html>
  );
}