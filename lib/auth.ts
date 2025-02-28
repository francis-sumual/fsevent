import prisma from "@/lib/prisma"
import { compare } from "bcrypt"
import type { User } from "@prisma/client"

export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

export async function createUser(userData: {
  name: string
  email: string
  password: string
}): Promise<User> {
  return prisma.user.create({
    data: userData,
  })
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword)
}

