import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Get all patients
export async function GET() {
  const patients = await prisma.patient.findMany();
  return NextResponse.json(patients);
}

// Add new patient
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      age,
      gender,
      weight,
      region,
      pregnantStatus,
      g6pdDeficiency,
    } = body;

    if (
      !fullName ||
      !age ||
      !gender ||
      !weight ||
      !region
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const patient = await prisma.patient.create({
      data: {
        fullName,
        age: Number(age),
        gender,
        weight: Number(weight),
        region,
        pregnantStatus: gender === "female" ? pregnantStatus : null,
        g6pdDeficiency: !!g6pdDeficiency,
      },
    });

    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add patient" },
      { status: 500 }
    );
  }
}