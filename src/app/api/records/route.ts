import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const records = await prisma.medicalRecord.findMany({
    include: {
      patient: true,
      predictionResult: {
        include: {
          treatmentRecommendation: true,
        },
      },
    },
  });
  return NextResponse.json(records);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      patientId,
      symptoms,
      previousMedications,
      predictedDisease,
      recommendedTreatment,
      notes,
    } = body;

    if (
      !patientId ||
      !symptoms ||
      !predictedDisease ||
      !recommendedTreatment
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log("Saving notes:", notes);

    const record = await prisma.medicalRecord.create({
      data: {
        patientId: Number(patientId),
        symptoms,
        previousMedications,
        predictionResult: {
          create: {
            predictedDisease,
            treatmentRecommendation: {
              create: {
                recommendedTreatment,
                notes: notes && notes.trim() !== "" ? notes : "No notes", // fallback if notes is empty
              },
            },
          },
        },
      },
    });

    return NextResponse.json(record, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save record" }, { status: 500 });
  }
}