import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export async function GET() {
  try {
    const getActiveGatherings = async () => {
      const gatherings = await prisma.gathering.findMany({
        where: {
          isActive: true,
          date: {
            gte: new Date(),
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
      return gatherings.filter((gathering) => gathering._count.registrations < gathering.capacity);
    };

    const gatherings = await unstable_cache(
      getActiveGatherings,
      ["active-gatherings"],
      { revalidate: 10 } // Cache for 10 seconds
    )();

    return NextResponse.json({ gatherings });
  } catch (error) {
    console.error("Error fetching active gatherings:", error);
    return NextResponse.json({ message: "Failed to fetch gatherings" }, { status: 500 });
  }
}
