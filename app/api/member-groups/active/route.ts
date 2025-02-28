import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const groups = await prisma.memberGroup.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ groups });
  } catch (error) {
    console.error("Error fetching active groups:", error);
    return NextResponse.json({ message: "Failed to fetch groups" }, { status: 500 });
  }
}
