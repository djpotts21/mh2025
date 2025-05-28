import { NextRequest, NextResponse } from "next/server";
import { supabase } from "lib/supabase";

export async function POST(req: NextRequest) {
  const { post_id } = await req.json();

  if (!post_id) {
    return NextResponse.json({ error: "Missing post_id" }, { status: 400 });
  }

  const { data: likes, error } = await supabase
    .from("likes")
    .select("user_id")
    .eq("post_id", post_id);

  if (error) {
    console.error("Like fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch likes" }, { status: 500 });
  }

  return NextResponse.json({ likes });
}
