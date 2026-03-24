"use client";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client"; // Ensure this is correctly imported.
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Separator } from "../ui/separator";
import { SidebarInset, SidebarTrigger } from "../ui/sidebar";

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();

  const baseUrl = pathname.split("/")[1];
  const extendedView = pathname.split("/")[2];

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/"); // redirect to login page
          window.location.reload();
        },
      },
    });
  };

  return (
    <div>
      <SidebarInset>
        <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
          {/* Sidebar Trigger */}
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />

          {/* Breadcrumb Section */}
          <Breadcrumb className="flex-1">
            {" "}
            {/* flex-1 will push it to the left */}
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block text-sm">
                <BreadcrumbLink href="#" className="text-sm">
                  <p className="text-xs">
                    {pathname === "/" ? "Dashboard" : baseUrl?.toUpperCase()}
                  </p>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  <p className="text-xs">{extendedView?.toUpperCase()}</p>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Logout Button - aligned to the right */}
          <button
            onClick={() => handleLogout()}
            className="text-sm text-red-400 hover:bg-red-600 hover:text-white transition-colors duration-300 p-2 rounded-lg ml-4"
          >
            Logout
          </button>
        </header>
      </SidebarInset>
    </div>
  );
};
