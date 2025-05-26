import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import * as handler from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const authOptions = handler.authOptions;

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await prisma.user.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ message: "User deleted" });
}
