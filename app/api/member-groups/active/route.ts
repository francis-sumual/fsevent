import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export async function GET() {
  try {
    const getActiveGroups = async () => {
      return await prisma.memberGroup.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          name: "asc",
        },
      });
    };

    const groups = await unstable_cache(
      getActiveGroups,
      ["active-groups"],
      { revalidate: 10 } // Cache for 10 seconds
    )();

    return NextResponse.json({ groups });
  } catch (error) {
    console.error("Error fetching active groups:", error);
    return NextResponse.json({ message: "Failed to fetch groups" }, { status: 500 });
  }
}
