import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { email, name, password } = await req.json();

  if (!email || !name || !password) {
    return new Response(JSON.stringify({ error: "All fields are required." }), { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "admin", // Use the string "admin" directly
      },
    });
    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (e: unknown) {
    // Log the error for debugging
    console.error("Admin signup error:", e);

    // Define a type for the error object with a 'code' property
    type PrismaError = { code?: string; message?: string };

    // Handle unique constraint violation (email already exists)
    if (typeof e === "object" && e !== null && "code" in e && (e as PrismaError).code === "P2002") {
      return new Response(JSON.stringify({ error: "Email already exists." }), { status: 400 });
    }
    // Return the error message if available
    const errorMessage = typeof e === "object" && e !== null && "message" in e ? (e as PrismaError).message : "Failed to create admin.";
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
