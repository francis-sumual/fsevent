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

    const [memberGroups, total] = await Promise.all([
      prisma.memberGroup.findMany({
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.memberGroup.count(),
    ]);

    return NextResponse.json({ memberGroups, total });
  } catch (error) {
    console.error("Error fetching member groups:", error);
    return NextResponse.json({ message: "Failed to fetch member groups" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const memberGroup = await prisma.memberGroup.create({
      data: {
        name: data.name,
        description: data.description,
        isActive: data.isActive,
      },
    });

    return NextResponse.json(memberGroup);
  } catch (error) {
    console.error("Error creating member group:", error);
    return NextResponse.json({ message: "Failed to create member group" }, { status: 500 });
  }
}
