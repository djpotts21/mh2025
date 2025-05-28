import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

  const { content } = await req.json();

  if (!decoded.user_id || !content?.trim()) {
    return NextResponse.json({ error: "Missing user_id or content" }, { status: 400 });
  }

  const { error } = await supabase.from("posts").insert({
    user_id: decoded.user_id,
    content,
  });

  if (error) {
    console.error("Post insert failed:", error);
    return NextResponse.json({ error: "Post failed" }, { status: 500 });
  }

  return NextResponse.json({ message: "Posted successfully" });
}
