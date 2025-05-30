import { NextRequest } from "next/server";
import { supabase } from "lib/supabase";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const commentId = params.id;

  const { data, error } = await supabase
    .from("comments")
    .select("id, content, created_at, parent_id, user:users(username, avatar_url)")
    .eq("parent_id", commentId)
    .order("created_at", { ascending: true });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
