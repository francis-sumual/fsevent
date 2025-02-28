import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import prisma from "@/lib/prisma"

// Update gathering
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { id } = params

    const gathering = await prisma.gathering.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        date: new Date(data.date),
        capacity: data.capacity,
        isActive: data.isActive,
      },
    })

    return NextResponse.json(gathering)
  } catch (error) {
    console.error("Error updating gathering:", error)
    return NextResponse.json({ message: "Failed to update gathering" }, { status: 500 })
  }
}

// Delete gathering
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    await prisma.gathering.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Gathering deleted successfully" })
  } catch (error) {
    console.error("Error deleting gathering:", error)
    return NextResponse.json({ message: "Failed to delete gathering" }, { status: 500 })
  }
}

