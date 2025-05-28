import { NextRequest } from "next/server";
import { supabase } from "lib/supabase"; // Adjust if needed

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const commentId = params.id; // ✅ SAFE inside async GET function

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
