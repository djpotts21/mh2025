import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const normalizedUsername = username.toLowerCase().trim();
  const avatar_url = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(username)}`;


  const supabase = createSupabaseClient("");

  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("username", normalizedUsername)
    .maybeSingle();

  if (existingUser) {
    return NextResponse.json({ error: "Username already exists" }, { status: 409 });
  }

  const password_hash = await bcrypt.hash(password, 10);
  const recovery_key = uuidv4().replace(/-/g, "").slice(0, 16);

  const { error } = await supabase.from("users").insert({
    username: normalizedUsername,
    password_hash,
    recovery_key,
    avatar_url,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    message: "User registered successfully",
    recoveryKey: recovery_key,
  });
}
