import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const users = await prisma.user.findMany();
  const patients = await prisma.patient.findMany();
  const records = await prisma.medicalRecord.findMany();

  return NextResponse.json({
    users,
    patients,
    records,
  });
}
