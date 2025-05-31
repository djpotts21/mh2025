import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { profile } from "console";

interface CommentRequestBody {
  post_id: string;
  content: string;
  parent_id?: string;
}

export async function POST(req: Request) {
  const body: CommentRequestBody = await req.json();
  const { post_id, content, parent_id } = body;

  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase.from("comments").insert([
    {
      post_id,
      content,
      user_id: user.id,
      parent_id: parent_id || null,
      profile: {
        username: user.user_metadata.username || "Anonymous",
        avatar_url: user.user_metadata.avatar_url || "https://api.dicebear.com/7.x/identicon/png?seed=" + user.id,
      },
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
