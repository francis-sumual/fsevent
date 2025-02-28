"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MemberTable } from "@/components/member-table";
import { MemberModal } from "@/components/member-modal";
import { useToast } from "@/components/ui/use-toast";
import type { Member } from "@/types/member";

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMembers, setTotalMembers] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const { toast } = useToast();

  const fetchMembers = async () => {
    try {
      const response = await fetch(`/api/members?page=${currentPage}&pageSize=${pageSize === "All" ? -1 : pageSize}`);

      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }

      const data = await response.json();
      setMembers(data.members);
      setTotalMembers(data.total);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load members. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [currentPage, pageSize]);

  const handleCreateMember = () => {
    setSelectedMember(null);
    setModalOpen(true);
  };

  const handleEditMember = (member: Member) => {
    setSelectedMember(member);
    setModalOpen(true);
  };

  const handleDeleteMember = async (member: Member) => {
    if (!confirm("Are you sure you want to delete this member?")) return;

    try {
      const response = await fetch(`/api/members/${member.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete member");

      toast({
        title: "Success",
        description: "Member deleted successfully",
      });

      fetchMembers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete member",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (member: Member) => {
    try {
      const response = await fetch(`/api/members/${member.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...member,
          isActive: !member.isActive,
        }),
      });

      if (!response.ok) throw new Error("Failed to update member");

      toast({
        title: "Success",
        description: `Member ${member.isActive ? "deactivated" : "activated"} successfully`,
      });

      fetchMembers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update member",
        variant: "destructive",
      });
    }
  };

  const handleModalClose = (refresh?: boolean) => {
    setModalOpen(false);
    setSelectedMember(null);
    if (refresh) {
      fetchMembers();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Members</h1>
          <p className="text-muted-foreground">Manage your members and their details.</p>
        </div>
        <Button onClick={handleCreateMember}>
          <Plus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>All Members</CardTitle>
            <CardDescription>A list of all members and their information.</CardDescription>
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
          <MemberTable
            members={members}
            currentPage={currentPage}
            pageSize={pageSize === "All" ? totalMembers : Number(pageSize)}
            totalMembers={totalMembers}
            isLoading={isLoading}
            onPageChange={setCurrentPage}
            onEdit={handleEditMember}
            onDelete={handleDeleteMember}
            onToggleActive={handleToggleActive}
          />
        </CardContent>
      </Card>

      <MemberModal open={modalOpen} onClose={handleModalClose} member={selectedMember} />
    </div>
  );
}
