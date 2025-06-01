import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const postId = new URL(req.url).searchParams.get("post_id");

  if (!postId) {
    return NextResponse.json({ error: "Missing post_id" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { count, error } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  if (error) {
    console.error("Count fetch error:", JSON.stringify(error, null, 2));
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }

  return NextResponse.json({ count });
}
