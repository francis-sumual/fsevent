import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/auth-provider";
import { LoadingProvider } from "@/components/loading-provider";
import { revalidatePath } from "next/cache";

revalidatePath("/", "layout");

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Registration",
  description: "Pendaftaran Tugas Misa",
};
export const fetchCache = "force-no-store";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <LoadingProvider>
            <Navbar />
            {children}
            <Toaster />
          </LoadingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
