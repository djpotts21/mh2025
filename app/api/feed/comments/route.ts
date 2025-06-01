import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("post_id");

  if (!postId) {
    return NextResponse.json({ error: "Missing post_id" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data, error } = await supabase
    .from("comments")
    .select(`
      *,
      user:profiles (
        username,
        avatar_url
      )
    `)
    .eq("post_id", postId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
