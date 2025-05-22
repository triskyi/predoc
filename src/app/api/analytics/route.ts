import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  // Example analytics, adjust as needed for your dashboard
  const totalPatients = await prisma.patient.count();
  const totalRecords = await prisma.medicalRecord.count();
  const totalPredictions = await prisma.predictionResult.count();
  const totalTreatments = await prisma.treatmentRecommendation.count();

  // Example: Disease distribution (group by predictedDisease)
  const diseaseDistributionRaw = await prisma.predictionResult.groupBy({
    by: ["predictedDisease"],
    _count: { predictedDisease: true },
  });
  const totalDisease = diseaseDistributionRaw.reduce((sum, d) => sum + d._count.predictedDisease, 0);
  const diseaseDistribution = diseaseDistributionRaw.map(d => ({
    label: d.predictedDisease,
    value: totalDisease ? Math.round((d._count.predictedDisease / totalDisease) * 100) : 0,
    color: d.predictedDisease === "Malaria" ? "#3b82f6" : d.predictedDisease === "Dengue" ? "#f59e42" : "#a78bfa"
  }));

  return NextResponse.json({
    totalPatients,
    totalRecords,
    totalPredictions,
    totalTreatments,
    diseaseDistribution,
    // Add more analytics as needed
  });
}