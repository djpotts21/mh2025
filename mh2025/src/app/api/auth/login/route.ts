import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const users: Record<string, any> = globalThis.users || {};
globalThis.users = users;

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const user = users[username];
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1d" });

  return NextResponse.json({ token });
}
