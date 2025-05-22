import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  const { params } = await context; // <-- await context
  const id = Number(params.id);
  if (!id) {
    return NextResponse.json({ error: "Invalid patient ID" }, { status: 400 });
  }
  const patient = await prisma.patient.findUnique({
    where: { id },
    select: {
      age: true,
      gender: true,
      weight: true,
      region: true,
      pregnantStatus: true,
      g6pdDeficiency: true,
    },
  });
  if (!patient) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }
  return NextResponse.json(patient);
}