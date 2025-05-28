import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  let decoded: any;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // Initialize Supabase client with service role key to bypass RLS checks
  const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
  );

  const { post_id, content, parent_id } = await req.json();

  const { error } = await supabase
    .from("comments")
    .insert({
      post_id,
      user_id: decoded.user_id,
      content,
      parent_id: parent_id || null,
    });

  if (error) {
    return NextResponse.json({ error: "Failed to comment" }, { status: 500 });
  }

  return NextResponse.json({ message: "Comment posted" });
}
