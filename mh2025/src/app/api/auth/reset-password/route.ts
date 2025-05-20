import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  let decoded: any;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch {
    return NextResponse.json({ error: "Expired or invalid token" }, { status: 401 });
  }

  const { newPassword } = await req.json();

  const hash = await bcrypt.hash(newPassword, 10);
  const newRecoveryKey = uuidv4().replace(/-/g, "").slice(0, 16);

  const { data: user, error } = await supabaseAdmin
    .from("users")
    .update({
      password_hash: hash,
      recovery_key: newRecoveryKey,
    })
    .eq("username", decoded.username)
    .select("id, username")
    .maybeSingle();

  if (error || !user) {
    console.error("Supabase update failed:", error);
    return NextResponse.json({ error: "Password update failed" }, { status: 500 });
  }

  const newToken = jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return NextResponse.json({
    message: "Password reset successful",
    recoveryKey: newRecoveryKey,
    token: newToken,
  });
}
