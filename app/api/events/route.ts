import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";   // ✅ better import path
import { getCurrentUser } from "../../lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, date, location } = await req.json();

    if (!title || !date || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),   // ✅ matches schema
        location,
        createdBy: user.id,     // ✅ matches schema
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const events =
      user.role === "ADMIN"
        ? await prisma.event.findMany()
        : await prisma.event.findMany({ where: { createdBy: user.id } }); // ✅ fixed

    return NextResponse.json(events);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
