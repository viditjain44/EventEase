// lib/auth.ts
import { NextRequest } from "next/server";
import { prisma } from "./prisma";

export async function getCurrentUser(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const payload = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        role: true,   // ✅ fetch role so /api/events works
      },
    });
    return user;
  } catch {
    return null;
  }
}
