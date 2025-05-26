import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma"; // Adjust import if your prisma instance is elsewhere

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const session = await getSession({ req });
  if (!session || !session.user?.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { name, phone, bio, photo } = req.body;

  try {
    const updated = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        phone,
        bio,
        photo,
      },
    });
    res.status(200).json({
      name: updated.name,
      phone: updated.phone,
      bio: updated.bio,
      photo: updated.photo,
      email: updated.email,
      role: updated.role,
    });
  } catch (error) {
    console.error("Failed to update profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
}

// The error 405 means "Method Not Allowed".
// This usually happens if you try to access this API route with a method other than POST (e.g., GET).
// Make sure your frontend is sending a POST request to /api/users/update-profile.
// If you visit this API route directly in the browser, it will default to GET and return 405.
// Solution: Only use POST for this endpoint from your frontend code.
