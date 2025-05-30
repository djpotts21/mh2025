// app/api/feed/comments/route.ts

import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase"; // adjust if you don’t use alias

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("post_id");

  if (!postId) {
    return new Response(JSON.stringify({ error: "Missing post_id" }), {
      status: 400,
    });
  }

  const { data, error } = await supabase
    .from("comments")
    .select(`
      id,
      post_id,
      content,
      created_at,
      parent_id,
      user:users (
        username,
        avatar_url
      )
    `)
    .eq("post_id", postId);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
