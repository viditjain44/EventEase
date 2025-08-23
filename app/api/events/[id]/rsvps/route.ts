import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getCurrentUser } from "../../../../lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const event = await prisma.event.findUnique({
      where: { id: params.id },
      select: { id: true, createdBy: true },
    });
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    const isOwner = event.createdBy === user.id;
    const isAdmin = user.role === "ADMIN";
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const rsvps = await prisma.rSVP.findMany({
      where: { eventId: params.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    return NextResponse.json(rsvps);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
