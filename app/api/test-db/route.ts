import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    // Test database connection
    const result = await prisma.$queryRaw`SELECT 1 as test`

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      result,
    })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        errorObject: JSON.stringify(error, Object.getOwnPropertyNames(error)),
      },
      { status: 500 },
    )
  }
}

