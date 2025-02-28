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
      orderBy: {
        date: "asc",
      },
    });

    return NextResponse.json({ gatherings });
  } catch (error) {
    console.error("Error fetching active gatherings:", error);
    return NextResponse.json({ message: "Failed to fetch gatherings" }, { status: 500 });
  }
}
