/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { GalleryVerticalEnd, Minus, Plus } from "lucide-react";

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
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
// import { adminDataLinks } from "@/lib/admin-sidebar-data";
import { usePathname } from "next/navigation";
import { getNavForPosition } from "@/lib/filterSidebar";

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const filteredAccessSideBar = getNavForPosition("ADMIN");
  return (
    <Sidebar
      {...props}
      className="bg-white border-r border-gray-200/50 font-inter"
    >
      <SidebarHeader className="bg-gradient-to-r from-black-500 to-black-400">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-cyan-600 text-white flex aspect-square size-8 items-center justify-center rounded-xl shadow-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none font-poppins font-bold">
                  <span>Admin Control</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-white text-gray-900">
        <SidebarGroup>
          <SidebarMenu>
            {filteredAccessSideBar.navMain.map((item, index) => (
              <Collapsible
                key={item.title}
                defaultOpen={index === 1}
                className="group/collapsible text-gray-900"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="hover:bg-gray-100/50 hover:text-cyan-600 transition-colors duration-300 font-poppins font-semibold">
                      {item.title}{" "}
                      <Plus className="ml-auto group-data-[state=open]/collapsible:hidden text-cyan-500" />
                      <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden text-cyan-500" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub className="text-gray-900 font-semibold">
                        {item.items.map((subItem: any) => {
                          const isActive = pathname === subItem.url;

                          return (
                            <SidebarMenuSubItem
                              key={subItem.url}
                              className={`text-gray-900 ${
                                isActive ? "bg-gray-100 text-cyan-600" : ""
                              }`}
                            >
                              <SidebarMenuSubButton
                                asChild
                                className={`transition-colors duration-300 font-semibold ${
                                  isActive
                                    ? "text-cyan-600"
                                    : "hover:text-cyan-500"
                                }`}
                              >
                                <a href={subItem.url}>
                                  {subItem.icon}
                                  {subItem.title}
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail className="bg-gray-100/50" />
    </Sidebar>
  );
}
