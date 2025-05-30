// app/api/feed/comments/[id]/replies/count/route.ts

import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase"; // Prefer "@/lib/..." over "lib/..."

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> } // <-- Key: params is a Promise
) {
  const { id } = await context.params; // <-- Key: await the params

  const { count, error } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("parent_id", id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ count }), {
    headers: { "Content-Type": "application/json" },
  });
}
