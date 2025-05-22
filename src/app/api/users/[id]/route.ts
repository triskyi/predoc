import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: { id: string } }) {
  const { params } = await context; // Await context to get params
  const userId = Number(params.id);
  if (!userId) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      // Add more fields if needed
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // You can add default values for fields not in the DB
  const profile = {
    name: user.name,
    email: user.email,
    phone: "", // Not in schema, so leave blank or fetch from another source
    username: user.email.split("@")[0], // Example username logic
    bio: "", // Not in schema, so leave blank or fetch from another source
    photo: "/avatar.png", // Default avatar
    role: user.role,
  };

  return NextResponse.json(profile);
}