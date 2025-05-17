import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

interface User {
  username: string;
  passwordHash: string;
  recoveryKey: string;
}

const users: Record<string, User> = {}; // Temporary in-memory store

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (users[username]) {
    return NextResponse.json({ error: "User exists" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const recoveryKey = uuidv4().replace(/-/g, "").slice(0, 16);

  users[username] = { username, passwordHash, recoveryKey };

  return NextResponse.json({ message: "Registered", recoveryKey });
}
