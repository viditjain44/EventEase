import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {prisma} from "../../lib/prisma";
import { Role } from "@prisma/client"; // 👈 import Role enum

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!email || !password || !role) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 👇 Validate role against enum
    if (!Object.values(Role).includes(role)) {
      return NextResponse.json(
        { success: false, error: `Invalid role: ${role}` },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name || null,
        email,
        password: hashedPassword,
        role: role as Role, // ✅ cast to enum
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    console.error("❌ Register API Error:", err.message || err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
