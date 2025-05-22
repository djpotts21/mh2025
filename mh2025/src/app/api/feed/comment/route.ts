import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase";
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

  const supabase = createSupabaseClient(token);
  const { post_id, content } = await req.json();

  const { error } = await supabase.from("comments").insert({
    post_id,
    user_id: decoded.user_id,
    content,
  });

  if (error) {
    return NextResponse.json({ error: "Failed to comment" }, { status: 500 });
  }

  return NextResponse.json({ message: "Comment posted" });
}
