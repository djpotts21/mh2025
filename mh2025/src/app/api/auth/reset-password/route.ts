//API/AUTH/RESET-PASSWORD/ROUTE.TS

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

function getSupabase(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Missing or invalid token" }, { status: 401 });
  }

  const supabase = getSupabase(token);

  const { username, newPassword } = await req.json();
  const normalizedUsername = username.toLowerCase().trim();

  const hash = await bcrypt.hash(newPassword, 10);
  const newRecoveryKey = uuidv4().replace(/-/g, "").slice(0, 16);

  const { data: user, error } = await supabase
    .from("users")
    .update({
      password_hash: hash,
      recovery_key: newRecoveryKey,
    })
    .eq("username", normalizedUsername)
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

  return NextResponse.json({ recoveryKey: newRecoveryKey, token: newToken });
}
