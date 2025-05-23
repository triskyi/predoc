import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const records = await prisma.medicalRecord.findMany({
    include: {
      patient: true,
      user: true,
      predictionResult: true,
    },
  });
  return NextResponse.json(records);
}
