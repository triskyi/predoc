import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const idOrEmail = params.id;

  let user;
  if (/^\d+$/.test(idOrEmail)) {
    // Numeric ID
    user = await prisma.user.findUnique({
      where: { id: Number(idOrEmail) },
    });
  } else {
    // Assume email
    user = await prisma.user.findUnique({
      where: { email: idOrEmail },
    });
  }

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
  }

  return new Response(JSON.stringify(user), { status: 200 });
}
