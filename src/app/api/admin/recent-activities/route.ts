import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const records = await prisma.medicalRecord.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      user: true,
      patient: true,
    },
  });

  const activities = records.map((rec) => ({
    icon: rec.user?.role === "doctor" ? "User" : "FileText",
    text: rec.user
      ? `${rec.user.role === "doctor" ? "Dr." : ""} ${rec.user.name} added/updated record for ${rec.patient.fullName}`
      : `Record updated for ${rec.patient.fullName}`,
    time: rec.createdAt.toLocaleDateString(),
  }));

  return NextResponse.json(activities);
}
