"use client";

import { Edit, Trash2, Power } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Gathering } from "@/types/gathering";

interface GatheringTableProps {
  gatherings: Gathering[];
  currentPage: number;
  pageSize: number;
  totalGatherings: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onEdit: (gathering: Gathering) => void;
  onDelete: (gathering: Gathering) => void;
  onToggleActive: (gathering: Gathering) => void;
}

export function GatheringTable({
  gatherings,
  currentPage,
  pageSize,
  totalGatherings,
  isLoading,
  onPageChange,
  onEdit,
  onDelete,
  onToggleActive,
}: GatheringTableProps) {
  const totalPages = Math.ceil(totalGatherings / pageSize);

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add first page
    if (startPage > 1) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink onClick={() => onPageChange(1)}>1</PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // Add pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink isActive={currentPage === i} onClick={() => onPageChange(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Add last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => onPageChange(totalPages)}>{totalPages}</PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gatherings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No gatherings found
              </TableCell>
            </TableRow>
          ) : (
            gatherings.map((gathering) => (
              <TableRow key={gathering.id}>
                <TableCell className="font-medium">{gathering.title}</TableCell>
                <TableCell>{gathering.location}</TableCell>
                <TableCell>{new Date(gathering.date).toLocaleDateString()}</TableCell>
                <TableCell>{gathering.capacity}</TableCell>
                <TableCell>
                  <Badge variant={gathering.isActive ? "default" : "secondary"}>
                    {gathering.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => onToggleActive(gathering)}>
                    <Power className="h-4 w-4" />
                    <span className="sr-only">{gathering.isActive ? "Deactivate" : "Activate"}</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(gathering)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(gathering)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                // disabled={currentPage === 1}
              />
            </PaginationItem>
            {renderPaginationItems()}
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                // disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
