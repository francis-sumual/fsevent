import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { hash } from "bcrypt"
import prisma from "@/lib/prisma"

// Update user
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { name, email, password } = await request.json()
    const { id } = params

    const updateData: any = {
      name,
      email,
    }

    if (password) {
      updateData.password = await hash(password, 10)
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ message: "Failed to update user" }, { status: 500 })
  }
}

// Delete user
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ message: "Failed to delete user" }, { status: 500 })
  }
}

