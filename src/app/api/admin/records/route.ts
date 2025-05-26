import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const records = await prisma.medicalRecord.findMany({
    include: {
      patient: true,
      user: true,
      predictionResult: true,
    },
  });
  return NextResponse.json(records);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const record = await prisma.medicalRecord.create({
    data: {
      patientId: Number(body.patientId),
      userId: Number(body.userId),
      symptoms: body.symptoms,
      previousMedications: body.previousMedications || null,
    },
  });
  return NextResponse.json(record, { status: 201 });
}
