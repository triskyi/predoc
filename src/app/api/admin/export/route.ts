import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const data: { users?: unknown[]; patients?: unknown[]; records?: unknown[] } = {};
  if (!type || type === "all") {
    data.users = await prisma.user.findMany();
    data.patients = await prisma.patient.findMany();
    data.records = await prisma.medicalRecord.findMany();
  } else if (type === "users") {
    data.users = await prisma.user.findMany();
  } else if (type === "patients") {
    data.patients = await prisma.patient.findMany();
  } else if (type === "records") {
    data.records = await prisma.medicalRecord.findMany();
  }




  return NextResponse.json(data);
}