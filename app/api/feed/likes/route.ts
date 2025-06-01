import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { post_id, comment_id } = body;

  if (!post_id && !comment_id) {
    return NextResponse.json({ error: "Missing target ID" }, { status: 400 });
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
