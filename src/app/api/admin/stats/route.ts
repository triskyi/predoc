import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const totalUsers = await prisma.user.count();
  const totalPatients = await prisma.patient.count();
  const totalRecords = await prisma.medicalRecord.count();
  const activeDoctors = await prisma.user.count({ where: { role: "doctor" } });
  const activeNurses = await prisma.user.count({ where: { role: "nurse" } });

  return NextResponse.json([
    {
      label: "Total Users",
      value: totalUsers,
      color: "blue",
      trend: "+5 this week",
      trendColor: "green",
    },
    {
      label: "Total Patients",
      value: totalPatients,
      color: "green",
      trend: "+12 this week",
      trendColor: "green",
    },
    {
      label: "Medical Records",
      value: totalRecords,
      color: "yellow",
      trend: "-2 this week",
      trendColor: "red",
    },
    {
      label: "Active Doctors",
      value: activeDoctors,
      color: "purple",
      trend: "+1 this week",
      trendColor: "green",
    },
    {
      label: "Active Nurses",
      value: activeNurses,
      color: "pink",
      trend: "+2 this week",
      trendColor: "green",
    },
  ]);
}
