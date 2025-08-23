// app/api/events/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { getCurrentUser } from "../../lib/auth";

// ✅ Get all events (only if logged in)
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const events =
      user.role === "ADMIN"
        ? await prisma.event.findMany({ orderBy: { date: "asc" } })
        : await prisma.event.findMany({
            where: { createdBy: user.id },
            orderBy: { date: "asc" },
          });

    return NextResponse.json(events, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/events error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ Create a new event (only if logged in)
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, date, location } = await req.json();

    if (!title || !date || !location) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        createdBy: user.id, // 👈 linked to logged-in user
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/events error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
