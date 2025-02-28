import type React from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { AdminSidebar } from "@/components/admin-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </SidebarProvider>
  )
}

