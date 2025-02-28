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

    const memberGroup = await prisma.memberGroup.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        isActive: data.isActive,
      },
    });

    return NextResponse.json(memberGroup);
  } catch (error) {
    console.error("Error updating member group:", error);
    return NextResponse.json({ message: "Failed to update member group" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    await prisma.memberGroup.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Member group deleted successfully" });
  } catch (error) {
    console.error("Error deleting member group:", error);
    return NextResponse.json({ message: "Failed to delete member group" }, { status: 500 });
  }
}
