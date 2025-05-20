import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Missing or invalid token" }, { status: 401 });
  }

  // Validate token
  let decoded: any;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch {
    return NextResponse.json({ error: "Expired or invalid token" }, { status: 401 });
  }

  const supabase = createSupabaseClient(token);
  const { newPassword } = await req.json();

  const hash = await bcrypt.hash(newPassword, 10);
  const newRecoveryKey = uuidv4().replace(/-/g, "").slice(0, 16);

  // Update password and recovery key for the user in the JWT
  const { data: user, error } = await supabase
    .from("users")
    .update({
      password_hash: hash,
      recovery_key: newRecoveryKey,
    })
    .select("id, username")
    .maybeSingle();

  if (error || !user) {
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
