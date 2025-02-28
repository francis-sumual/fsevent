import type { DefaultSession } from "next-auth"

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
  }
}

// Extend the JWT type
declare module "next-auth/jwt" {
  interface JWT {
    id: string
  }
}

