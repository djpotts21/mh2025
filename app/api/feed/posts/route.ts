import { NextResponse } from "next/server";
import { supabase } from "lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("posts")
    .select("*, user:users(username, avatar_url)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase posts fetch error:", error);
    return NextResponse.json({ error: "Failed to load posts" }, { status: 500 });
  }

  return NextResponse.json(data);
}
