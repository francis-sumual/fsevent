import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    // if (!session) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get("groupId");
    const gatheringId = searchParams.get("gatheringId");

    if (!groupId || !gatheringId) {
      return NextResponse.json({ message: "Missing required parameters" }, { status: 400 });
    }

    // Find members who are active, belong to the selected group,
    // and haven't registered for this gathering yet
    const availableMembers = await prisma.member.findMany({
      where: {
        isActive: true,
        groupId,
        registrations: {
          none: {
            gatheringId,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ members: availableMembers });
  } catch (error) {
    console.error("Error fetching available members:", error);
    return NextResponse.json({ message: "Failed to fetch available members" }, { status: 500 });
  }
}
