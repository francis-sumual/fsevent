import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export async function GET() {
  try {
    // Use unstable_cache to cache the results with a short TTL
    const getGatherings = async () => {
      return await prisma.gathering.findMany({
        where: {
          isActive: true,
          date: {
            gte: new Date(),
          },
        },
        include: {
          registrations: {
            include: {
              member: {
                include: {
                  group: true,
                },
              },
            },
            orderBy: {
              createdAt: "asc",
            },
          },
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
    };

    const gatherings = await unstable_cache(
      getGatherings,
      ["gatherings-with-registrations"],
      { revalidate: 10 } // Cache for 10 seconds
    )();

    return NextResponse.json({ gatherings });
  } catch (error) {
    console.error("Error fetching gatherings with registrations:", error);
    return NextResponse.json({ message: "Failed to fetch gatherings" }, { status: 500 });
  }
}
