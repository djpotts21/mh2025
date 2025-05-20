import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export async function POST(req: NextRequest) {
  const { username, recoveryKey } = await req.json();
  const normalizedUsername = username.toLowerCase().trim();

  // Step 1: Lookup user by username
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", normalizedUsername)
    .maybeSingle();

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const now = new Date();
  if (user.recovery_locked_until && new Date(user.recovery_locked_until) > now) {
    return NextResponse.json({ error: "Account temporarily locked. Try again later." }, { status: 429 });
  }

  // Step 2: Check recovery key
  if (user.recovery_key !== recoveryKey) {
    const attempts = (user.recovery_attempts || 0) + 1;
    const updates: Record<string, any> = { recovery_attempts: attempts };

    if (attempts >= 5) {
      const lockUntil = new Date();
      lockUntil.setMinutes(lockUntil.getMinutes() + 15);
      updates.recovery_locked_until = lockUntil.toISOString();
    }

    await supabase
      .from("users")
      .update(updates)
      .eq("username", normalizedUsername)
      .select();

    return NextResponse.json({ error: "Invalid recovery key" }, { status: 401 });
  }

  // Step 3: Reset recovery lock and issue short-lived JWT
  await supabase
    .from("users")
    .update({ recovery_attempts: 0, recovery_locked_until: null })
    .eq("username", normalizedUsername)
    .select();

  const recoveryToken = jwt.sign(
    { username: user.username }, // 👈 critical for RLS
    JWT_SECRET,
    { expiresIn: "15m" }
  );

  return NextResponse.json({ message: "Recovery key valid", token: recoveryToken });
}
