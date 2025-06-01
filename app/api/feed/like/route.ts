import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  let { post_id, comment_id } = await req.json();

  // Clean up values
  if (post_id === "null" || post_id === undefined) post_id = null;
  if (comment_id === "null" || comment_id === undefined) comment_id = null;

  if ((post_id && comment_id) || (!post_id && !comment_id)) {
    return NextResponse.json(
      { error: "Provide either post_id or comment_id" },
      { status: 400 }
    );
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

  // Check for existing like
  const { data: existingLike, error: fetchError } = await supabase
    .from("likes")
    .select("id")
    .match({ ...target, user_id: user.id })
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: "Failed to check like" }, { status: 500 });
  }

  if (existingLike) {
    // Unlike
    const { error: deleteError } = await supabase
      .from("likes")
      .delete()
      .eq("id", existingLike.id);

    if (deleteError) {
      return NextResponse.json({ error: "Failed to unlike" }, { status: 500 });
    }

    return NextResponse.json({ message: "Unliked" });
  } else {
    // Like
    const { error: insertError } = await supabase.from("likes").insert({
      ...target,
      user_id: user.id,
    });

    if (insertError) {
      return NextResponse.json({ error: "Failed to like" }, { status: 500 });
    }

    return NextResponse.json({ message: "Liked" });
  }
}
