import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { id } = params;

    const registration = await prisma.gatheringRegistration.update({
      where: { id },
      data: {
        status: data.status,
      },
      include: {
        member: {
          include: {
            group: true,
          },
        },
        gathering: true,
      },
    });

    return NextResponse.json(registration);
  } catch (error) {
    console.error("Error updating registration:", error);
    return NextResponse.json({ message: "Failed to update registration" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    await prisma.gatheringRegistration.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Registration deleted successfully" });
  } catch (error) {
    console.error("Error deleting registration:", error);
    return NextResponse.json({ message: "Failed to delete registration" }, { status: 500 });
  }
}
