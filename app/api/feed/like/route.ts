import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { post_id } = await req.json();

  const cookieStore = await cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if the user has already liked the post
  const { data: existingLike, error: likeFetchError } = await supabase
    .from("likes")
    .select("id")
    .eq("post_id", post_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (likeFetchError) {
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
      post_id,
      user_id: user.id,
    });

    if (insertError) {
      return NextResponse.json({ error: "Failed to like" }, { status: 500 });
    }

    return NextResponse.json({ message: "Liked" });
  }
}
