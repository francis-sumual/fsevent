import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Get all gatherings (admin only) with pagination
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

    const [gatherings, total] = await Promise.all([
      prisma.gathering.findMany({
        skip,
        take,
        orderBy: {
          date: "desc",
        },
      }),
      prisma.gathering.count(),
    ]);

    return NextResponse.json({ gatherings, total });
  } catch (error) {
    console.error("Error fetching gatherings:", error);
    return NextResponse.json({ message: "Failed to fetch gatherings" }, { status: 500 });
  }
}

// Create new gathering
export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const gathering = await prisma.gathering.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        date: new Date(data.date),
        capacity: data.capacity,
        isActive: data.isActive,
      },
    });
    revalidatePath("/");
    revalidatePath("/api/gatherings/active");
    revalidatePath("/api/gatherings/with-registrations");
    return NextResponse.json(gathering);
  } catch (error) {
    console.error("Error creating gathering:", error);
    return NextResponse.json({ message: "Failed to create gathering" }, { status: 500 });
  }
}
