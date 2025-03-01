import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    // if (!session) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "10");

    const skip = pageSize === -1 ? undefined : (page - 1) * pageSize;
    const take = pageSize === -1 ? undefined : pageSize;

    const [registrations, total] = await Promise.all([
      prisma.gatheringRegistration.findMany({
        skip,
        take,
        include: {
          member: {
            include: {
              group: true,
            },
          },
          gathering: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.gatheringRegistration.count(),
    ]);

    return NextResponse.json({ registrations, total });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json({ message: "Failed to fetch registrations" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    // if (!session) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const data = await request.json();

    // Check if member is already registered
    const existingRegistration = await prisma.gatheringRegistration.findUnique({
      where: {
        memberId_gatheringId: {
          memberId: data.memberId,
          gatheringId: data.gatheringId,
        },
      },
    });

    if (existingRegistration) {
      return NextResponse.json({ message: "Member is already registered for this gathering" }, { status: 400 });
    }

    // Check gathering capacity
    const gathering = await prisma.gathering.findUnique({
      where: { id: data.gatheringId },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    if (!gathering) {
      return NextResponse.json({ message: "Gathering not found" }, { status: 404 });
    }

    if (gathering._count.registrations >= gathering.capacity) {
      return NextResponse.json({ message: "Gathering is at full capacity" }, { status: 400 });
    }

    const registration = await prisma.gatheringRegistration.create({
      data: {
        memberId: data.memberId,
        gatheringId: data.gatheringId,
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
    revalidatePath("/");
    revalidatePath("/api/gatherings/with-registrations");
    return NextResponse.json(registration);
  } catch (error) {
    console.error("Error creating registration:", error);
    return NextResponse.json({ message: "Failed to create registration" }, { status: 500 });
  }
}
