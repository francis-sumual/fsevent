"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { Gathering } from "@/types/gathering";
import type { MemberGroup } from "@/types/member-group";
import type { Member } from "@/types/member";

interface GatheringWithCount extends Gathering {
  _count: {
    registrations: number;
  };
}

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [gatherings, setGatherings] = useState<GatheringWithCount[]>([]);
  const [groups, setGroups] = useState<MemberGroup[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [formData, setFormData] = useState({
    gatheringId: "",
    groupId: "",
    memberId: "",
  });

  // Fetch active gatherings
  useEffect(() => {
    const fetchGatherings = async () => {
      try {
        const response = await fetch("/api/gatherings/active");
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
    };

    fetchGatherings();
  }, []);

  // Fetch active groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch("/api/member-groups/active");
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
    };

    fetchGroups();
  }, []);

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

      toast({
        title: "Success",
        description: "Registration completed successfully",
      });

      // Reset form
      setFormData({
        gatheringId: "",
        groupId: "",
        memberId: "",
      });

      // Redirect to success page
      router.push("/register/success");
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

  const selectedGathering = gatherings.find((g) => g.id === formData.gatheringId);

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Gathering Registration</CardTitle>
          <CardDescription>Register for an upcoming gathering</CardDescription>
        </CardHeader>
        <CardContent>
          {gatherings.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">
                No available gatherings at the moment.
                <br />
                Please check back later or contact the administrator.
              </p>
              <Button variant="outline" onClick={() => router.push("/registrations")}>
                View All Gatherings
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="gatheringId">Select Gathering</Label>
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
                    <SelectValue placeholder="Select a gathering" />
                  </SelectTrigger>
                  <SelectContent>
                    {gatherings.map((gathering) => (
                      <SelectItem key={gathering.id} value={gathering.id}>
                        <div className="flex flex-col">
                          <div>{gathering.title}</div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(gathering.date).toLocaleDateString()}
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
                <Label htmlFor="groupId">Select Group</Label>
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
                    <SelectValue placeholder="Select your group" />
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
                <Label htmlFor="memberId">Select Your Name</Label>
                <Select
                  value={formData.memberId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, memberId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your name" />
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
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
