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
  import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
  import { Menu } from "lucide-react";
  import { useIsMobile } from "@/hooks/use-mobile";

  export function AdminSidebar(props: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();
    const filteredAccessSideBar = getNavForPosition("ADMIN");
    const isMobile = useIsMobile();
    const sidebarContent = (
      <>
        <SidebarHeader className="bg-gradient-to-r from-indigo-700 to-indigo-500">
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
                      <SidebarMenuButton className="hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-300 font-poppins font-semibold">
                        {item.title}{" "}
                        <Plus className="ml-auto group-data-[state=open]/collapsible:hidden text-indigo-500" />
                        <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden text-indigo-500" />
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
                                  isActive ? "bg-indigo-50 text-indigo-600" : ""
                                }`}
                              >
                                <SidebarMenuSubButton
                                  asChild
                                  className={`transition-colors duration-300 font-semibold ${
                                    isActive
                                      ? "text-indigo-600"
                                      : "hover:text-indigo-500"
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
      </>
    );
    if (isMobile) {
      return (
        <Sheet>
          <SheetTrigger asChild>
            <button className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md border border-slate-200 text-indigo-600 hover:bg-indigo-50 focus:outline-none">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 max-w-full">
            {sidebarContent}
          </SheetContent>
        </Sheet>
      );
    }
    return (
      <Sidebar {...props} className="bg-white border-r border-indigo-100 font-inter shadow-md">
        {sidebarContent}
      </Sidebar>
    );
  }
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail className="bg-gray-100/50" />
    </Sidebar>
  );
}
