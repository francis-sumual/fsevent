"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MemberGroupTable } from "@/components/member-group-table";
import { MemberGroupModal } from "@/components/member-group-modal";
import { useToast } from "@/components/ui/use-toast";
import type { MemberGroup } from "@/types/member-group";

export default function MemberGroupsPage() {
  const [memberGroups, setMemberGroups] = useState<MemberGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalGroups, setTotalGroups] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<MemberGroup | null>(null);
  const { toast } = useToast();

  const fetchMemberGroups = async () => {
    try {
      const response = await fetch(
        `/api/member-groups?page=${currentPage}&pageSize=${pageSize === "All" ? -1 : pageSize}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch member groups");
      }

      const data = await response.json();
      setMemberGroups(data.memberGroups);
      setTotalGroups(data.total);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load member groups. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberGroups();
  }, [currentPage, pageSize]);

  const handleCreateGroup = () => {
    setSelectedGroup(null);
    setModalOpen(true);
  };

  const handleEditGroup = (group: MemberGroup) => {
    setSelectedGroup(group);
    setModalOpen(true);
  };

  const handleDeleteGroup = async (group: MemberGroup) => {
    if (!confirm("Are you sure you want to delete this member group?")) return;

    try {
      const response = await fetch(`/api/member-groups/${group.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete member group");

      toast({
        title: "Success",
        description: "Member group deleted successfully",
      });

      fetchMemberGroups();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete member group",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (group: MemberGroup) => {
    try {
      const response = await fetch(`/api/member-groups/${group.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...group,
          isActive: !group.isActive,
        }),
      });

      if (!response.ok) throw new Error("Failed to update member group");

      toast({
        title: "Success",
        description: `Member group ${group.isActive ? "deactivated" : "activated"} successfully`,
      });

      fetchMemberGroups();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update member group",
        variant: "destructive",
      });
    }
  };

  const handleModalClose = (refresh?: boolean) => {
    setModalOpen(false);
    setSelectedGroup(null);
    if (refresh) {
      fetchMemberGroups();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Member Groups</h1>
          <p className="text-muted-foreground">Manage your member groups and their settings.</p>
        </div>
        <Button onClick={handleCreateGroup}>
          <Plus className="mr-2 h-4 w-4" />
          Add Group
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>All Member Groups</CardTitle>
            <CardDescription>A list of all member groups and their details.</CardDescription>
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
          <MemberGroupTable
            memberGroups={memberGroups}
            currentPage={currentPage}
            pageSize={pageSize === "All" ? totalGroups : Number(pageSize)}
            totalGroups={totalGroups}
            isLoading={isLoading}
            onPageChange={setCurrentPage}
            onEdit={handleEditGroup}
            onDelete={handleDeleteGroup}
            onToggleActive={handleToggleActive}
          />
        </CardContent>
      </Card>

      <MemberGroupModal open={modalOpen} onClose={handleModalClose} memberGroup={selectedGroup} />
    </div>
  );
}
