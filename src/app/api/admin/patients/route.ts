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
  const patients = await prisma.patient.findMany();
  return NextResponse.json(patients);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const patient = await prisma.patient.create({
    data: {
      fullName: body.fullName,
      age: Number(body.age),
      gender: body.gender,
      region: body.region,
      weight: Number(body.weight),
      pregnantStatus: body.pregnantStatus || null,
      g6pdDeficiency: !!body.g6pdDeficiency,
    },
  });
  return NextResponse.json(patient, { status: 201 });
}
