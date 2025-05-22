import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const normalizedUsername = username.toLowerCase().trim();

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", normalizedUsername)
    .maybeSingle();

  if (error || !user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // ✅ Ensure avatar exists
  if (!user.avatar_url) {
    const avatar_url = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.username)}`;

    await supabase
      .from("users")
      .update({ avatar_url })
      .eq("id", user.id);

    user.avatar_url = avatar_url; // update in memory for the token
  }

  // ✅ Generate RLS-compatible JWT
  const token = jwt.sign(
    {
      userId: user.id,              // optional
      username: user.username,      // optional
      user_id: user.id,             // 🔐 REQUIRED for RLS (bigint)
      avatar_url: user.avatar_url   // optional
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return NextResponse.json({ token });
}
