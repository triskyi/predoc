import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  const data = users.map((u) => ({
    name: u.name,
    email: u.email,
    role: u.role,
    joined: u.createdAt.toISOString().slice(0, 10),
  }));

  return NextResponse.json(data);
}
