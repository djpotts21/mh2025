// === FILE: app/api/feed/like/route.ts ===

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

interface JwtPayload {
  user_id: string;
  [key: string]: unknown;
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 401 });

  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const { post_id }: { post_id: string } = await req.json();

  if (!post_id || !decoded.user_id) {
    return NextResponse.json({ error: "Missing post_id or user_id" }, { status: 400 });
  }

  const { data: existing, error: fetchError } = await supabase
    .from("likes")
    .select("id")
    .eq("post_id", post_id)
    .eq("user_id", decoded.user_id)
    .maybeSingle();

  if (fetchError) {
    console.error("Error checking existing like:", fetchError);
    return NextResponse.json({ error: "Failed to check like" }, { status: 500 });
  }

  if (existing) {
    const { error: deleteError } = await supabase
      .from("likes")
      .delete()
      .eq("id", existing.id);

    if (deleteError) {
      console.error("Error removing like:", deleteError);
      return NextResponse.json({ error: "Failed to unlike" }, { status: 500 });
    }

    return NextResponse.json({ message: "Unliked" });
  } else {
    const { error: insertError } = await supabase.from("likes").insert({
      post_id,
      user_id: decoded.user_id,
    });

    if (insertError) {
      console.error("Error inserting like:", insertError);
      return NextResponse.json({ error: "Failed to like" }, { status: 500 });
    }

    return NextResponse.json({ message: "Liked" });
  }
}
