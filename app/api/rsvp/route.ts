import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

// POST /api/rsvp → create RSVP
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, eventId } = body;

    if (!name || !email || !eventId) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    // Save RSVP
    const rsvp = await prisma.rSVP.create({
      data: {
        name,
        email,
        eventId,
      },
    });

    return NextResponse.json({ success: true, rsvp });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
