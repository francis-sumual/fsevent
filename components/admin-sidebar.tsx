"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LayoutDashboard, Users, LogOut, Calendar, UserSquare2, ClipboardList } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const menuItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Gatherings",
      href: "/admin/gatherings",
      icon: Calendar,
    },
    {
      title: "Members",
      href: "/admin/members",
      icon: Users,
    },
    {
      title: "Member Groups",
      href: "/admin/member-groups",
      icon: UserSquare2,
    },
    {
      title: "Registrations",
      href: "/admin/registrations",
      icon: ClipboardList,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2">
          <span className="text-lg font-bold">Admin Panel</span>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2">
          <div className="mb-2 flex items-center gap-2 px-2">
            <div className="h-8 w-8 rounded-full bg-primary/10" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{session?.user?.name || "User"}</span>
              <span className="text-xs text-muted-foreground truncate">
                {session?.user?.email || "user@example.com"}
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
