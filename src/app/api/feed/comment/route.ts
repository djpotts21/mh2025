import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  let decoded: any;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error("JWT verification failed:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

const supabase = createSupabaseClient(process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { post_id, content } = await req.json();

  if (!post_id || !content || typeof content !== "string") {
    return NextResponse.json({ error: "Missing or invalid post_id or content" }, { status: 400 });
  }

  const { error } = await supabase.from("comments").insert({
    post_id,
    user_id: decoded.user_id,
    content,
  });

  if (error) {
    console.error("Failed to insert comment:", error);
    return NextResponse.json({ error: "Failed to comment", details: error }, { status: 500 });
  }

  return NextResponse.json({ message: "Comment posted" });
}
