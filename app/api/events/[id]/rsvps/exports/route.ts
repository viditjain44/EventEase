import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { getCurrentUser } from "../../../../../lib/auth";

function toCsv(rows: Array<Record<string, any>>) {
  if (!rows.length) return "name,email,createdAt\n";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push(headers.map((h) => {
      const v = r[h];
      const s = v instanceof Date ? v.toISOString() : String(v ?? "");
      // quote if needed
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(","));
  }
  return lines.join("\n") + "\n";
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const event = await prisma.event.findUnique({
      where: { id: params.id },
      select: { id: true, title: true, createdBy: true },
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
      select: { name: true, email: true, createdAt: true },
    });

    const csv = toCsv(rsvps);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="rsvps-${event.title.replace(/\W+/g, "-").toLowerCase()}.csv"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
