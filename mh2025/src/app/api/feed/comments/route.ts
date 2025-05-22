import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { post_id } = await req.json();

  const { data, error } = await supabase
    .from("comments")
    .select("*, user:users(username, avatar_url)")
    .eq("post_id", post_id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Failed to load comments" }, { status: 500 });
  }

  return NextResponse.json(data);
}
