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

    // 1. Create MedicalRecord
    const record = await prisma.medicalRecord.create({
      data: {
        patientId: Number(patientId),
        symptoms,
        previousMedications,
      },
    });

    // 2. Create PredictionResult
    const predictionResult = await prisma.predictionResult.create({
      data: {
        medicalRecordId: record.id,
        predictedDisease,
      },
    });

    // 3. Create TreatmentRecommendation
    const treatmentRecommendation = await prisma.treatmentRecommendation.create({
      data: {
        predictionResultId: predictionResult.id,
        recommendedTreatment,
        notes,
      },
    });

    return NextResponse.json(
      { record, predictionResult, treatmentRecommendation },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to save record" }, { status: 500 });
  }
}