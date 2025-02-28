"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Users, Search, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const [selectedGathering, setSelectedGathering] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>(["registered", "attended", "cancelled"]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

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

  const filteredGatherings = gatherings
    .filter((gathering) => {
      if (selectedGathering === "all") return true;
      return gathering.id === selectedGathering;
    })
    .map((gathering) => ({
      ...gathering,
      registrations: gathering.registrations.filter((registration) => {
        const matchesSearch =
          searchQuery === "" ||
          registration.member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          registration.member.group.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter.includes(registration.status);
        return matchesSearch && matchesStatus;
      }),
    }))
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  const toggleStatus = (status: string) => {
    setStatusFilter((current) =>
      current.includes(status) ? current.filter((s) => s !== status) : [...current, status]
    );
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
          <p className="text-muted-foreground">Pastikan nama anda ada dalam daftar petugas misa yang dipilih.</p>
        </div>
        <Button asChild>
          <Link href="/register">
            Daftar Tugas
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Select value={selectedGathering} onValueChange={setSelectedGathering}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gathering" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Misa</SelectItem>
                  {gatherings.map((gathering) => (
                    <SelectItem key={gathering.id} value={gathering.id}>
                      {/* {gathering.title} - {new Date(gathering.date).toLocaleDateString()} */}
                      {gathering.title} -{" "}
                      {new Intl.DateTimeFormat("id-ID", { year: "numeric", month: "2-digit", day: "2-digit" }).format(
                        new Date(gathering.date)
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari nama atau kelompok..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-[150px]">
                    <Filter className="mr-2 h-4 w-4" />
                    Status Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[150px]">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes("registered")}
                    onCheckedChange={() => toggleStatus("registered")}
                  >
                    Registered
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes("attended")}
                    onCheckedChange={() => toggleStatus("attended")}
                  >
                    Attended
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes("cancelled")}
                    onCheckedChange={() => toggleStatus("cancelled")}
                  >
                    Cancelled
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" onClick={() => setSortOrder((current) => (current === "asc" ? "desc" : "asc"))}>
                <Calendar className="mr-2 h-4 w-4" />
                {sortOrder === "asc" ? "Oldest First" : "Newest First"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {filteredGatherings.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-40">
              <p className="text-muted-foreground mb-4">No gatherings found matching your filters.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedGathering("all");
                  setSearchQuery("");
                  setStatusFilter(["registered", "attended", "cancelled"]);
                }}
              >
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredGatherings.map((gathering) => (
            <Card key={gathering.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{gathering.title}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Intl.DateTimeFormat("id-ID", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          }).format(new Date(gathering.date))}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
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
                  <div className="text-sm font-medium">Registered Members ({gathering.registrations.length})</div>
                  {gathering.registrations.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No registrations found matching your filters.</p>
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
