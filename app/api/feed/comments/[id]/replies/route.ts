export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: commentId } = await context.params;

  const cookieStore = cookies(); // don't await
  const supabase = createServerComponentClient({ cookies: () => Promise.resolve(cookieStore) });

  const { data, error } = await supabase
    .from("comments")
    .select("* , profile: user(user_metadata(username, avatar_url))")
    .eq("parent_id", commentId);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
