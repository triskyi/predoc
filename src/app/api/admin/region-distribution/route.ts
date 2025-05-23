import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const regions = await prisma.patient.groupBy({
    by: ["region"],
    _count: { region: true },
  });

  // Filter out null/empty regions
  const data = regions
    .filter((r) => r.region)
    .map((r) => ({
      region: r.region,
      count: r._count.region,
    }));

  return NextResponse.json(data);
}
