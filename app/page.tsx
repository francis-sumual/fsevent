"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { RegisterSection } from "@/components/register-section";
import { RegistrationsSection } from "@/components/registration-section";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Refresh the page data when component mounts
    router.refresh();

    // Set up periodic refresh every 30 seconds
    const intervalId = setInterval(() => {
      router.refresh();
    }, 30000);
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-18 xl:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Prodiakon Gereja Santa Anna
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Sistim pendaftaran tugas Misa Minggu Palma dan Tri Hari Suci 2025
              </p>
            </div>

            <div className="space-x-4">
              <Link href="#register">
                <Button>
                  Daftar Tugas <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#registrations">
                <Button>
                  Lihat Pendaftaran <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mt-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Perhatikan dengan baik hal-hal dibawah ini sebelum melakukan pendaftaran
              </h2>

              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="mr-2 h-4 w-4 rounded-full bg-primary" />
                  <span>Pastikan memilih dengan benar jadwal tugas misa yang diinginkan</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 h-4 w-4 rounded-full bg-primary" />
                  <span>Dua Pendaftar terakhir akan menjadi petugas cadangan</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 h-4 w-4 rounded-full bg-primary" />
                  <span>
                    Jika quota sudah terpenuhi maka tidak dimungkinkan untuk mendaftar, cek pada list pendaftaran misa
                    yang masih available atau sudah full.
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="mr-2 h-4 w-4 rounded-full bg-primary" />
                  <span>Jika ada masalah silahkah hubungi ketua kelompok</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <RegisterSection />

      <RegistrationsSection />

      <footer className="w-full border-t bg-background  px-10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-muted-foreground md:text-left">
              &copy; {new Date().getFullYear()} FSDev. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="#register" className="text-sm text-muted-foreground hover:underline">
                Daftar Tugas
              </Link>
              <Link href="#registrations" className="text-sm text-muted-foreground hover:underline">
                Lihat Pendaftaran
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
