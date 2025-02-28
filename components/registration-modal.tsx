"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import type { GatheringRegistration } from "@/types/gathering-registration";
import type { Gathering } from "@/types/gathering";
import type { MemberGroup } from "@/types/member-group";
import type { Member } from "@/types/member";

interface RegistrationModalProps {
  open: boolean;
  onClose: (refresh?: boolean) => void;
  registration?: GatheringRegistration | null;
}

export function RegistrationModal({ open, onClose, registration }: RegistrationModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [gatherings, setGatherings] = useState<Gathering[]>([]);
  const [groups, setGroups] = useState<MemberGroup[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [formData, setFormData] = useState({
    gatheringId: "",
    groupId: "",
    memberId: "",
    status: "registered",
  });

  useEffect(() => {
    fetchGatherings();
    fetchGroups();
  }, []);

  useEffect(() => {
    if (registration) {
      setFormData({
        gatheringId: registration.gatheringId,
        groupId: registration.member.groupId,
        memberId: registration.memberId,
        status: registration.status,
      });
    } else {
      setFormData({
        gatheringId: "",
        groupId: "",
        memberId: "",
        status: "registered",
      });
    }
  }, [registration]);

  useEffect(() => {
    if (formData.groupId && formData.gatheringId) {
      fetchAvailableMembers();
    }
  }, [formData.groupId, formData.gatheringId]);

  const fetchGatherings = async () => {
    try {
      const response = await fetch("/api/gatherings?pageSize=-1");
      if (!response.ok) throw new Error("Failed to fetch gatherings");
      const data = await response.json();
      setGatherings(data.gatherings.filter((g: Gathering) => g.isActive));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load gatherings",
        variant: "destructive",
      });
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await fetch("/api/member-groups?pageSize=-1");
      if (!response.ok) throw new Error("Failed to fetch groups");
      const data = await response.json();
      setGroups(data.memberGroups.filter((g: MemberGroup) => g.isActive));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load member groups",
        variant: "destructive",
      });
    }
  };

  const fetchAvailableMembers = async () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = registration ? `/api/registrations/${registration.id}` : "/api/registrations";
      const method = registration ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Something went wrong");
      }

      toast({
        title: "Success",
        description: `Registration ${registration ? "updated" : "created"} successfully`,
      });

      onClose(true);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{registration ? "Edit Registration" : "Create Registration"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gatheringId">Gathering</Label>
            <Select
              value={formData.gatheringId}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, gatheringId: value }))}
              disabled={!!registration}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a gathering" />
              </SelectTrigger>
              <SelectContent>
                {gatherings.map((gathering) => (
                  <SelectItem key={gathering.id} value={gathering.id}>
                    {gathering.title} - {new Date(gathering.date).toLocaleDateString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="groupId">Member Group</Label>
            <Select
              value={formData.groupId}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, groupId: value, memberId: "" }))}
              disabled={!!registration}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a group" />
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
            <Label htmlFor="memberId">Member</Label>
            <Select
              value={formData.memberId}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, memberId: value }))}
              disabled={!!registration}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a member" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="registered">Registered</SelectItem>
                <SelectItem value="attended">Attended</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onClose()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : registration ? "Save Changes" : "Create Registration"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
