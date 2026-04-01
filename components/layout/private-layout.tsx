"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "@/lib/auth-client";

// Lucide Icons
import {
  LayoutDashboard,
  ShoppingCart,
  User,
  Users,
  Settings,
  Package,
  LogOut,
  Tags,
  GalleryVerticalEnd,
  ChevronRight,
  Bell,
  Search,
} from "lucide-react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarProvider,
  SidebarDesktopTrigger,
  SidebarMobileTrigger,
  SidebarInset,
  SidebarRail,
} from "@/components/ui/sidebar";

// New Navbar Components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

/* ====================== ROLE & MENU TYPES ====================== */
export type Role =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "OWNER"
  | "MANAGER"
  | "ACCOUNTANT"
  | "CLIENT";

interface MenuModule {
  key: string;
  icon: React.ElementType;
  title: string;
  url: string;
  items?: { title: string; url: string }[];
}

/* ====================== MODULE DEFINITIONS ====================== */
const adminModules: MenuModule[] = [
  {
    key: "dashboard",
    icon: LayoutDashboard,
    title: "Dashboard",
    url: "/admin/dashboard",
  },
  { key: "orders", icon: ShoppingCart, title: "Orders", url: "/admin/orders" },
  { key: "products", icon: Package, title: "Products", url: "/admin/products" },
  {
    key: "categories",
    icon: Tags,
    title: "Categories",
    url: "/admin/categories",
  },
  { key: "customers", icon: Users, title: "Customers", url: "/admin/users" },
  { key: "settings", icon: Settings, title: "Settings", url: "/admin/profile" },
];

const clientModules: MenuModule[] = [
  { key: "my-orders", icon: ShoppingCart, title: "Orders", url: "/orders" },
  { key: "my-carts", icon: ShoppingCart, title: "Carts", url: "/carts" },
  { key: "profile", icon: User, title: "Profile", url: "/profile" },
];

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

const pathToKey: Record<string, string> = {
  "/admin/dashboard": "dashboard",
  "/admin/orders": "orders",
  "/admin/products": "products",
  "/admin/categories": "categories",
  "/admin/users": "customers",
  "/admin/profile": "settings",
  "/orders": "my-orders",
  "/carts": "my-carts",
  "/profile": "profile",
};

/* ====================== LAYOUT COMPONENT ====================== */
const PrivateLayout: React.FC<{ roles?: Role[]; children: ReactNode }> = ({
  roles = ["CLIENT"],
  children,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const allowedKeys = Array.from(
    new Set(roles.flatMap((r) => roleModuleAccess[r] || [])),
  );
  const isClientOnly = roles.length === 1 && roles.includes("CLIENT");
  const modules = isClientOnly ? clientModules : adminModules;
  const visibleModules = modules.filter((m) => allowedKeys.includes(m.key));

  const activeKey =
    pathToKey[pathname] || (isClientOnly ? "my-orders" : "dashboard");
  const currentModule = visibleModules.find((m) => m.key === activeKey);

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
    <SidebarProvider>
      {/* 1. APP SIDEBAR */}
      <Sidebar
        variant="inset"
        collapsible="icon"
        className="border-r z-100 shadow-sm font-poppins"
      >
        <SidebarHeader className="p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                asChild
                className="hover:bg-accent transition-colors"
              >
                <Link href={isClientOnly ? "/orders" : "/admin/dashboard"}>
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none font-bold">
                    <span>{isClientOnly ? "Royal Client" : "Royal Admin"}</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
              {visibleModules.map((module, index) => {
                const isActive = activeKey === module.key;
                const hasItems = module.items && module.items.length > 0;

                if (hasItems) {
                  return (
                    <Collapsible
                      key={module.key}
                      asChild
                      defaultOpen={index === 0}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={module.title}>
                            <module.icon className="h-4 w-4" />
                            <span>{module.title}</span>
                            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {module.items?.map((subItem) => {
                              const isSubActive = pathname === subItem.url;
                              return (
                                <SidebarMenuSubItem key={subItem.url}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={isSubActive}
                                  >
                                    <Link href={subItem.url}>
                                      <span>{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={module.key}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={module.title}
                    >
                      <Link href={module.url}>
                        <module.icon className="h-4 w-4" />
                        <span>{module.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        {/* Sidebar Footer (Keep for quick collapse access or mini user card) */}
        <SidebarRail />
      </Sidebar>

      {/* 2. MAIN CONTENT AREA */}
      <SidebarInset className="bg-transparent flex flex-col min-h-screen">
        {/* --- UPGRADED SLEEK ADMIN NAVBAR --- */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 md:px-6 shadow-sm transition-all">
          {/* Left Side: Trigger & Breadcrumbs */}
          <div className="flex items-center gap-2">
            <SidebarMobileTrigger className="-ml-2 text-muted-foreground hover:text-foreground" />
            <SidebarDesktopTrigger className="-ml-2 text-muted-foreground hover:text-foreground" />
            <Separator
              orientation="vertical"
              className="mr-2 h-4 hidden md:block"
            />

            {/* Dynamic Breadcrumb */}
            <Breadcrumb className="hidden md:flex">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={isClientOnly ? "/orders" : "/admin/dashboard"}>
                      {isClientOnly ? "Client" : "Admin"}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold text-foreground">
                    {currentModule?.title || "Dashboard"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Right Side: Actions & User Avatar */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mock Search Button (Optional) */}
            {/* <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hidden sm:flex"
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button> */}

            {/* Notification Bell */}
            {/* <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground relative"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-600" />
              <span className="sr-only">Notifications</span>
            </Button> */}

            <Separator
              orientation="vertical"
              className="h-6 mx-1 hidden sm:block"
            />

            {/* User Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full border border-border/50"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="/placeholder-avatar.jpg"
                      alt="User Avatar"
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      AD
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 font-poppins"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Admin User
                    </p>
                    <p className="text-xs text-muted-foreground leading-none">
                      admin@royalimport.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* --- DYNAMIC PAGE CONTENT --- */}
        <main className="flex-1 overflow-auto">
          <div className="w-full  flex-1 rounded-xl border bg-card text-card-foreground shadow-sm p-4 md:p-6 lg:p-8">
            {children}
          </div>

          <footer className="mt-8 text-center text-sm text-muted-foreground font-medium">
            Royal Import © {new Date().getFullYear()}
          </footer>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default PrivateLayout;
