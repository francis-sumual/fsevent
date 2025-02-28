import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Get active gatherings with their registration counts
    const gatherings = await prisma.gathering.findMany({
      where: {
        isActive: true,
        date: {
          gte: new Date(), // Only future gatherings
        },
      },
      include: {
        _count: {
          select: {
            registrations: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    // Filter out gatherings that are full
    const availableGatherings = gatherings.filter((gathering) => gathering._count.registrations < gathering.capacity);

    return NextResponse.json({ gatherings: availableGatherings });
  } catch (error) {
    console.error("Error fetching active gatherings:", error);
    return NextResponse.json({ message: "Failed to fetch gatherings" }, { status: 500 });
  }
}
