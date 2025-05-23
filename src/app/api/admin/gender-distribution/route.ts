import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const male = await prisma.patient.count({ where: { gender: "male" } });
  const female = await prisma.patient.count({ where: { gender: "female" } });
  const other = await prisma.patient.count({ where: { gender: "other" } });

  return NextResponse.json([
    { gender: "Male", count: male },
    { gender: "Female", count: female },
    { gender: "Other", count: other },
  ]);
}
