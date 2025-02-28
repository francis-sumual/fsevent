import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const gatherings = await prisma.gathering.findMany({
      where: {
        isActive: true,
        date: {
          gte: new Date(), // Only future gatherings
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

    return NextResponse.json({ gatherings });
  } catch (error) {
    console.error("Error fetching gatherings with registrations:", error);
    return NextResponse.json({ message: "Failed to fetch gatherings" }, { status: 500 });
  }
}
