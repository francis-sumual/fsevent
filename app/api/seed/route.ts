import { NextResponse } from "next/server"
import { hash } from "bcrypt"
import prisma from "@/lib/prisma"

// This is a development-only route to seed the database with initial data
export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "This endpoint is not available in production" }, { status: 403 })
  }

  try {
    // Create admin user if it doesn't exist
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@example.com" },
      select: { id: true },
    })

    if (!existingAdmin) {
      const hashedPassword = await hash("password123", 10)

      await prisma.user.create({
        data: {
          name: "Admin User",
          email: "admin@example.com",
          password: hashedPassword,
        },
      })
    }

    // Add more seed data here as needed

    return NextResponse.json({ success: true, message: "Database seeded successfully" })
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json({ success: false, error: "Failed to seed database" }, { status: 500 })
  }
}

