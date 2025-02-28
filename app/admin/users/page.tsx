"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserTable } from "@/components/user-table"
import { UserModal } from "@/components/user-modal"
import { useToast } from "@/components/ui/use-toast"
import type { User } from "@/types/user"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pageSize, setPageSize] = useState("10")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const { toast } = useToast()

  const fetchUsers = async () => {
    try {
      const response = await fetch(`/api/users?page=${currentPage}&pageSize=${pageSize === "All" ? -1 : pageSize}`)

      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const data = await response.json()
      setUsers(data.users)
      setTotalUsers(data.total)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [currentPage, pageSize])

  const handleCreateUser = () => {
    setSelectedUser(null)
    setModalOpen(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setModalOpen(true)
  }

  const handleDeleteUser = async (user: User) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete user")

      toast({
        title: "Success",
        description: "User deleted successfully",
      })

      fetchUsers()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    }
  }

  const handleModalClose = (refresh?: boolean) => {
    setModalOpen(false)
    setSelectedUser(null)
    if (refresh) {
      fetchUsers()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage your users and their permissions.</p>
        </div>
        <Button onClick={handleCreateUser}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>All Users</CardTitle>
            <CardDescription>A list of all users in your application.</CardDescription>
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
          <UserTable
            users={users}
            currentPage={currentPage}
            pageSize={pageSize === "All" ? totalUsers : Number(pageSize)}
            totalUsers={totalUsers}
            isLoading={isLoading}
            onPageChange={setCurrentPage}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        </CardContent>
      </Card>

      <UserModal open={modalOpen} onClose={handleModalClose} user={selectedUser} />
    </div>
  )
}

