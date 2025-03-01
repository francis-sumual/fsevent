"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { useLoading } from "@/components/loading-provider";

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { isLoading } = useLoading();
  const isAuthenticated = status === "authenticated";
  // Don't show navbar on admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="w-full border-b bg-background">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold">FS</span>
          <span className="text-blue-500 font-bold text-xl">Dev</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="#register" className="text-sm font-medium hover:underline underline-offset-4">
            Daftar
          </Link>
          <Link href="#registrations" className="text-sm font-medium hover:underline underline-offset-4">
            Lihat Pendaftaran
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          {status === "loading" || isLoading ? (
            <div className="h-9 w-20 animate-pulse rounded-md bg-muted"></div>
          ) : isAuthenticated ? (
            <>
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">
                  <p>Sign In</p>
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
