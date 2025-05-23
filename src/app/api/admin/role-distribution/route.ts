import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const admin = await prisma.user.count({ where: { role: "admin" } });
  const doctor = await prisma.user.count({ where: { role: "doctor" } });
  const nurse = await prisma.user.count({ where: { role: "nurse" } });

  return NextResponse.json([
    { role: "Admin", count: admin },
    { role: "Doctor", count: doctor },
    { role: "Nurse", count: nurse },
  ]);
}
