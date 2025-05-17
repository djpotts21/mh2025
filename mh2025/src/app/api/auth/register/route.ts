import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Missing username or password" }, { status: 400 });
  }

  const normalizedUsername = username.toLowerCase().trim();

  // Check if username already exists
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("username", normalizedUsername)
    .maybeSingle();

  if (existingUser) {
    return NextResponse.json({ error: "Username already exists" }, { status: 409 });
  }

  const password_hash = await bcrypt.hash(password, 10);
  const recovery_key = uuidv4().replace(/-/g, "").slice(0, 16); // 16-char alphanumeric

  const { error } = await supabase.from("users").insert({
    username: normalizedUsername,
    password_hash,
    recovery_key,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    message: "User registered successfully",
    recoveryKey: recovery_key,
  });
}
