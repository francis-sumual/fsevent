import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "10");

    const skip = pageSize === -1 ? undefined : (page - 1) * pageSize;
    const take = pageSize === -1 ? undefined : pageSize;

    const [members, total] = await Promise.all([
      prisma.member.findMany({
        skip,
        take,
        include: {
          group: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.member.count(),
    ]);

    return NextResponse.json({ members, total });
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json({ message: "Failed to fetch members" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const member = await prisma.member.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        isActive: data.isActive,
        groupId: data.groupId,
      },
      include: {
        group: true,
      },
    });

    return NextResponse.json(member);
  } catch (error) {
    console.error("Error creating member:", error);
    return NextResponse.json({ message: "Failed to create member" }, { status: 500 });
  }
}
