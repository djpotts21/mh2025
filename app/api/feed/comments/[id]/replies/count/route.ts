// app/api/feed/comments/[id]/replies/count/route.ts

import { NextRequest } from "next/server";
import { supabase } from "lib/supabase";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const commentId = params.id;

  const { count, error } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("parent_id", commentId);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ count }), {
    headers: { "Content-Type": "application/json" },
  });
}
