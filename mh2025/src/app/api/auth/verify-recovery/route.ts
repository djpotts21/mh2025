import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

// Public client for read access
const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Service role client for secure updates (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export async function POST(req: NextRequest) {
  const { username, recoveryKey } = await req.json();
  const normalizedUsername = username.toLowerCase().trim();

  // Step 1: Fetch the user
  const { data: user, error } = await supabasePublic
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

    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update(updates)
      .eq("username", normalizedUsername)
      .select();

    if (updateError) {
      console.error("Failed to update attempts:", updateError);
    }

    return NextResponse.json({ error: "Invalid recovery key" }, { status: 401 });
  }

  // Step 3: Reset attempts and lockout if valid
  await supabaseAdmin
    .from("users")
    .update({ recovery_attempts: 0, recovery_locked_until: null })
    .eq("username", normalizedUsername)
    .select();

  // Step 4: Return short-lived JWT
  const tempToken = jwt.sign(
    { username: user.username },
    JWT_SECRET,
    { expiresIn: "15m" }
  );

  return NextResponse.json({
    message: "Recovery key valid",
    token: tempToken,
  });
}
