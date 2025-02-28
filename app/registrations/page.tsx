"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import type { Gathering } from "@/types/gathering";
import type { GatheringRegistration } from "@/types/gathering-registration";

interface GatheringWithRegistrations extends Gathering {
  registrations: GatheringRegistration[];
  _count: {
    registrations: number;
  };
}

export default function RegistrationsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [gatherings, setGatherings] = useState<GatheringWithRegistrations[]>([]);

  useEffect(() => {
    fetchGatherings();
  }, []);

  const fetchGatherings = async () => {
    try {
      const response = await fetch("/api/gatherings/with-registrations");
      if (!response.ok) throw new Error("Failed to fetch gatherings");
      const data = await response.json();
      setGatherings(data.gatherings);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load registrations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">List Pendaftaran</h1>
          <p className="text-muted-foreground">Pastikan nama anda ada dalam list pendaftaran sesuai tugas misa.</p>
        </div>
        <Button asChild>
          <Link href="/register">
            Daftar tugas
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {gatherings.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-40">
              <p className="text-muted-foreground mb-4">No active gatherings found.</p>
              <Button asChild>
                <Link href="/">Return Home</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          gatherings.map((gathering) => (
            <Card key={gathering.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{gathering.title}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Tanggal misa</span>
                          {/* {new Date(gathering.date).toLocaleDateString()} */}
                          {new Intl.DateTimeFormat("id-ID", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          }).format(new Date(gathering.date))}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>Jumlah pendaftar dan total petugas</span>
                          {gathering._count.registrations} / {gathering.capacity}
                        </div>
                      </div>
                    </CardDescription>
                  </div>
                  <Badge variant={gathering._count.registrations >= gathering.capacity ? "destructive" : "default"}>
                    {gathering._count.registrations >= gathering.capacity ? "Full" : "Available"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm font-medium">Nama Prodiakon/Prodiakoness</div>
                  {gathering.registrations.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No registrations yet.</p>
                  ) : (
                    <div className="grid gap-2">
                      {gathering.registrations.map((registration) => (
                        <div
                          key={registration.id}
                          className="flex items-center justify-between py-2 border-b last:border-0"
                        >
                          <div>
                            <div className="font-medium">{registration.member.name}</div>
                            <div className="text-sm text-muted-foreground">{registration.member.group.name}</div>
                          </div>
                          <Badge
                            variant={
                              registration.status === "attended"
                                ? "default"
                                : registration.status === "cancelled"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {registration.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
