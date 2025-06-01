import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const body = await req.json();
  let { post_id, comment_id } = body;

  // ✅ Clean up "null" strings or undefined
  if (post_id === "null" || post_id === undefined) post_id = null;
  if (comment_id === "null" || comment_id === undefined) comment_id = null;

  // ✅ Require exactly one valid ID
  if ((post_id && comment_id) || (!post_id && !comment_id)) {
    return NextResponse.json({ error: "Must provide either post_id or comment_id" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ Construct target filter safely
  const target = post_id ? { post_id } : { comment_id };

  const { data, error } = await supabase
    .from("likes")
    .select("user_id")
    .match(target);

  if (error) {
    console.error("Like fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch likes" }, { status: 500 });
  }

  return NextResponse.json({ likes: data || [] });
}
