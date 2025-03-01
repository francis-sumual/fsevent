"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, RefreshCcw, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import type { Gathering } from "@/types/gathering";
import type { MemberGroup } from "@/types/member-group";
import type { Member } from "@/types/member";
import { RegistrationSuccessDialog } from "./registration-success-dialog";

interface GatheringWithCount extends Gathering {
  _count: {
    registrations: number;
  };
}

const registrationEventEmitter = new EventTarget();
export const REGISTRATION_UPDATED_EVENT = "registrationUpdated";
export const REGISTRATION_UPDATED = "REGISTRATION_UPDATED";
export const dynamic = "force-dynamic";
export const revalidate = 5;
export const fetchCache = "force-no-store";

export function RegisterSection() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [gatherings, setGatherings] = useState<GatheringWithCount[]>([]);
  const [groups, setGroups] = useState<MemberGroup[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [successGathering, setSuccessGathering] = useState<GatheringWithCount | null>(null);
  const [formData, setFormData] = useState({
    gatheringId: "",
    groupId: "",
    memberId: "",
  });

  const fetchGatherings = useCallback(async () => {
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/gatherings/active?t=${timestamp}`);
      if (!response.ok) throw new Error("Failed to fetch gatherings");
      const data = await response.json();
      setGatherings(data.gatherings);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load gatherings",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Fetch active groups
  const fetchGroups = useCallback(async () => {
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/member-groups/active?t=${timestamp}`);
      if (!response.ok) throw new Error("Failed to fetch groups");
      const data = await response.json();
      setGroups(data.groups);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load member groups",
        variant: "destructive",
      });
    }
  }, [toast]);

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([fetchGatherings(), fetchGroups()]);
    setIsRefreshing(false);
  }, [fetchGatherings, fetchGroups]);

  // Initial data fetch
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Periodic refresh (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshData]);

  // Fetch available members when group is selected
  useEffect(() => {
    const fetchAvailableMembers = async () => {
      if (!formData.groupId || !formData.gatheringId) return;

      try {
        const response = await fetch(
          `/api/registrations/available-members?groupId=${formData.groupId}&gatheringId=${formData.gatheringId}`
        );
        if (!response.ok) throw new Error("Failed to fetch members");
        const data = await response.json();
        setMembers(data.members);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load available members",
          variant: "destructive",
        });
      }
    };

    fetchAvailableMembers();
  }, [formData.groupId, formData.gatheringId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          status: "registered",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }
      const gathering = gatherings.find((g) => g.id === formData.gatheringId);
      if (gathering) {
        setSuccessGathering(gathering);
        setSuccessDialogOpen(true);

        // Dispatch custom event for registration update
        const event = new CustomEvent(REGISTRATION_UPDATED);
        window.dispatchEvent(event);

        // Reset form
        setFormData({
          gatheringId: "",
          groupId: "",
          memberId: "",
        });
      }

      registrationEventEmitter.dispatchEvent(new CustomEvent(REGISTRATION_UPDATED_EVENT));
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Registration failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
    setSuccessGathering(null);

    // Scroll to registrations section
    const registrationsSection = document.getElementById("registrations");
    if (registrationsSection) {
      registrationsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const selectedGathering = gatherings.find((g) => g.id === formData.gatheringId);

  return (
    <section id="register" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Form Pendaftaran</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={refreshData}
                disabled={isRefreshing}
                className="rounded-full"
                title="Refresh available gatherings"
              >
                <RefreshCcw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                <span className="sr-only">Refresh</span>
              </Button>
            </div>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Jika ada masalah dalam pendaftaran atau memerlukan bantuan silahkan hubungi ketua kelompok
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-2xl mt-8">
          <Card>
            <CardContent className="pt-6">
              {gatherings.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">
                    No available gatherings at the moment.
                    <br />
                    Please check back later or contact the administrator.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="gatheringId">Pilih Misa</Label>
                    <Select
                      value={formData.gatheringId}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          gatheringId: value,
                          memberId: "", // Reset member selection
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Misa" />
                      </SelectTrigger>
                      <SelectContent>
                        {gatherings.map((gathering) => (
                          <SelectItem key={gathering.id} value={gathering.id}>
                            <div className="flex flex-col">
                              <div>{gathering.title}</div>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Intl.DateTimeFormat("id-ID", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                  }).format(new Date(gathering.date))}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {gathering._count.registrations} / {gathering.capacity}
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedGathering && (
                      <div className="text-sm text-muted-foreground mt-2">
                        <p>{selectedGathering.description}</p>
                        <p className="mt-1">
                          Location: {selectedGathering.location}
                          <br />
                          Available Spots: {selectedGathering.capacity - selectedGathering._count.registrations}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="groupId">Pilih Kelompok</Label>
                    <Select
                      value={formData.groupId}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          groupId: value,
                          memberId: "", // Reset member selection
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Kelompok Anda" />
                      </SelectTrigger>
                      <SelectContent>
                        {groups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="memberId">Pilih Nama</Label>
                    <Select
                      value={formData.memberId}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, memberId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Hanya Nama Anda" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.length === 0 ? (
                          <SelectItem value="none" disabled>
                            No available members found
                          </SelectItem>
                        ) : (
                          members.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {members.length === 0 && formData.groupId && (
                      <p className="text-sm text-muted-foreground">
                        All members from this group are already registered or the group has no active members.
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || !formData.gatheringId || !formData.groupId || !formData.memberId}
                  >
                    {isLoading ? "Registering..." : "Register"}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Don't see a gathering or group? Try refreshing the data.
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {successGathering && (
        <RegistrationSuccessDialog
          open={successDialogOpen}
          onClose={handleSuccessDialogClose}
          gatheringTitle={successGathering.title}
          gatheringDate={successGathering.date}
        />
      )}
    </section>
  );
}
