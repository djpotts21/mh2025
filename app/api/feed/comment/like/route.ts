import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "lib/supabase";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 401 });

  let decoded: any;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const { comment_id } = await req.json();
  const user_id = decoded.user_id;

  const supabase = createSupabaseClient(token);

  // Check if already liked
  const { data: existing, error: fetchError } = await supabase
    .from("likes")
    .select("*")
    .eq("comment_id", comment_id)
    .eq("user_id", user_id)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: "Like check failed" }, { status: 500 });
  }

  if (existing) {
    // Unlike
    const { error: deleteError } = await supabase
      .from("likes")
      .delete()
      .eq("id", existing.id);

    if (deleteError) {
      return NextResponse.json({ error: "Failed to unlike comment" }, { status: 500 });
    }

    return NextResponse.json({ message: "Unliked" });
  } else {
    // Like
    const { error: insertError } = await supabase.from("likes").insert({
      comment_id,
      user_id,
    });

    if (insertError) {
      return NextResponse.json({ error: "Failed to like comment" }, { status: 500 });
    }

    return NextResponse.json({ message: "Liked" });
  }
}
