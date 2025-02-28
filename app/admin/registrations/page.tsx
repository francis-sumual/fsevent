"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RegistrationTable } from "@/components/registration-table";
import { RegistrationModal } from "@/components/registration-modal";
import { useToast } from "@/components/ui/use-toast";
import type { GatheringRegistration } from "@/types/gathering-registration";

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<GatheringRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<GatheringRegistration | null>(null);
  const { toast } = useToast();

  const fetchRegistrations = async () => {
    try {
      const response = await fetch(
        `/api/registrations?page=${currentPage}&pageSize=${pageSize === "All" ? -1 : pageSize}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch registrations");
      }

      const data = await response.json();
      setRegistrations(data.registrations);
      setTotalRegistrations(data.total);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load registrations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [currentPage, pageSize]);

  const handleCreateRegistration = () => {
    setSelectedRegistration(null);
    setModalOpen(true);
  };

  const handleEditRegistration = (registration: GatheringRegistration) => {
    setSelectedRegistration(registration);
    setModalOpen(true);
  };

  const handleDeleteRegistration = async (registration: GatheringRegistration) => {
    if (!confirm("Are you sure you want to delete this registration?")) return;

    try {
      const response = await fetch(`/api/registrations/${registration.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete registration");

      toast({
        title: "Success",
        description: "Registration deleted successfully",
      });

      fetchRegistrations();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete registration",
        variant: "destructive",
      });
    }
  };

  const handleModalClose = (refresh?: boolean) => {
    setModalOpen(false);
    setSelectedRegistration(null);
    if (refresh) {
      fetchRegistrations();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gathering Registrations</h1>
          <p className="text-muted-foreground">Manage gathering registrations for members.</p>
        </div>
        <Button onClick={handleCreateRegistration}>
          <Plus className="mr-2 h-4 w-4" />
          Add Registration
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>All Registrations</CardTitle>
            <CardDescription>A list of all gathering registrations.</CardDescription>
          </div>
          <Select value={pageSize} onValueChange={setPageSize}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select page size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 per page</SelectItem>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="All">Show all</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <RegistrationTable
            registrations={registrations}
            currentPage={currentPage}
            pageSize={pageSize === "All" ? totalRegistrations : Number(pageSize)}
            totalRegistrations={totalRegistrations}
            isLoading={isLoading}
            onPageChange={setCurrentPage}
            onEdit={handleEditRegistration}
            onDelete={handleDeleteRegistration}
          />
        </CardContent>
      </Card>

      <RegistrationModal open={modalOpen} onClose={handleModalClose} registration={selectedRegistration} />
    </div>
  );
}
