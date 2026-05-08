"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GalleryVerticalEnd,
  ChevronRight,
  LayoutDashboard,
  ShoppingCart,
  Package,
  Tags,
  Users,
  Settings,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";

type SidebarSubItem = {
  title: string;
  url: string;
  icon?: React.ReactNode;
};

type SidebarMainItem = {
  title: string;
  url: string;
  icon: React.ReactNode;
  items?: SidebarSubItem[];
};

const filteredAccessSideBar: { navMain: SidebarMainItem[] } = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      title: "Orders",
      url: "/admin/orders",
      icon: <ShoppingCart className="h-4 w-4" />,
    },
    {
      title: "Products",
      url: "/admin/products",
      icon: <Package className="h-4 w-4" />,
    },
    {
      title: "Categories",
      url: "/admin/categories",
      icon: <Tags className="h-4 w-4" />,
    },
    {
      title: "Customers",
      url: "/admin/users",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Settings",
      url: "/admin/profile",
      icon: <Settings className="h-4 w-4" />,
    },
  ],
};

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  // We use Shadcn's built-in state to know if it's collapsed, rather than localStorage
  const { state } = useSidebar(); 

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-indigo-100 shadow-md font-poppins"
      {...props}
    >
      {/* HEADER */}
      <SidebarHeader className="bg-gradient-to-r from-indigo-700 to-indigo-600 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              size="lg" 
              asChild 
              className="hover:bg-indigo-800/50 text-white"
            >
              <Link href="/admin/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-cyan-500 text-white shadow-sm">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                {state === "expanded" && (
                  <div className="flex flex-col gap-0.5 leading-none font-bold">
                    <span>Admin Control</span>
                  </div>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="bg-white text-gray-900">
        <SidebarGroup>
          <SidebarMenu>
            {filteredAccessSideBar.navMain.map((item, index: number) => {
              const hasSubItems = Boolean(item.items?.length);

              // IF IT HAS SUB-MENUS (COLLAPSIBLE)
              if (hasSubItems) {
                return (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={index === 0}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        {/* The 'tooltip' prop automatically handles collapsed hover states! */}
                        <SidebarMenuButton 
                          tooltip={item.title}
                          className="hover:bg-indigo-50 hover:text-indigo-600 font-semibold transition-colors duration-200"
                        >
                          {item.icon}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90 text-indigo-400" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => {
                            const isActive = pathname === subItem.url;
                            return (
                              <SidebarMenuSubItem key={subItem.url}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isActive}
                                  className={cn(
                                    "font-medium transition-colors duration-200",
                                    isActive 
                                      ? "bg-indigo-50 text-indigo-600" 
                                      : "text-gray-600 hover:text-indigo-500 hover:bg-indigo-50/50"
                                  )}
                                >
                                  <Link href={subItem.url}>
                                    {subItem.icon}
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

              // IF IT DOES NOT HAVE SUB-MENUS (STANDARD LINK)
              const isActive = pathname === item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive}
                    className={cn(
                      "font-semibold transition-colors duration-200",
                      isActive
                        ? "bg-indigo-50 text-indigo-600"
                        : "hover:bg-indigo-50 hover:text-indigo-600"
                    )}
                  >
                    <Link href={item.url}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* RAILS allow users to drag/resize or click to expand */}
      <SidebarRail />
    </Sidebar>
  );
}