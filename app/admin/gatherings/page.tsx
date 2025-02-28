"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GatheringTable } from "@/components/gathering-table"
import { GatheringModal } from "@/components/gathering-modal"
import { useToast } from "@/components/ui/use-toast"
import type { Gathering } from "@/types/gathering"

export default function GatheringsPage() {
  const [gatherings, setGatherings] = useState<Gathering[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pageSize, setPageSize] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalGatherings, setTotalGatherings] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedGathering, setSelectedGathering] = useState<Gathering | null>(null)
  const { toast } = useToast()

  const fetchGatherings = async () => {
    try {
      const response = await fetch(`/api/gatherings?page=${currentPage}&pageSize=${pageSize === "All" ? -1 : pageSize}`)

      if (!response.ok) {
        throw new Error("Failed to fetch gatherings")
      }

      const data = await response.json()
      setGatherings(data.gatherings)
      setTotalGatherings(data.total)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load gatherings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGatherings()
  }, [currentPage, pageSize])

  const handleCreateGathering = () => {
    setSelectedGathering(null)
    setModalOpen(true)
  }

  const handleEditGathering = (gathering: Gathering) => {
    setSelectedGathering(gathering)
    setModalOpen(true)
  }

  const handleDeleteGathering = async (gathering: Gathering) => {
    if (!confirm("Are you sure you want to delete this gathering?")) return

    try {
      const response = await fetch(`/api/gatherings/${gathering.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete gathering")

      toast({
        title: "Success",
        description: "Gathering deleted successfully",
      })

      fetchGatherings()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete gathering",
        variant: "destructive",
      })
    }
  }

  const handleToggleActive = async (gathering: Gathering) => {
    try {
      const response = await fetch(`/api/gatherings/${gathering.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...gathering,
          isActive: !gathering.isActive,
        }),
      })

      if (!response.ok) throw new Error("Failed to update gathering")

      toast({
        title: "Success",
        description: `Gathering ${gathering.isActive ? "deactivated" : "activated"} successfully`,
      })

      fetchGatherings()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update gathering",
        variant: "destructive",
      })
    }
  }

  const handleModalClose = (refresh?: boolean) => {
    setModalOpen(false)
    setSelectedGathering(null)
    if (refresh) {
      fetchGatherings()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gatherings</h1>
          <p className="text-muted-foreground">Manage your gatherings and events.</p>
        </div>
        <Button onClick={handleCreateGathering}>
          <Plus className="mr-2 h-4 w-4" />
          Add Gathering
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>All Gatherings</CardTitle>
            <CardDescription>A list of all gatherings and their details.</CardDescription>
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
          <GatheringTable
            gatherings={gatherings}
            currentPage={currentPage}
            pageSize={pageSize === "All" ? totalGatherings : Number(pageSize)}
            totalGatherings={totalGatherings}
            isLoading={isLoading}
            onPageChange={setCurrentPage}
            onEdit={handleEditGathering}
            onDelete={handleDeleteGathering}
            onToggleActive={handleToggleActive}
          />
        </CardContent>
      </Card>

      <GatheringModal open={modalOpen} onClose={handleModalClose} gathering={selectedGathering} />
    </div>
  )
}

