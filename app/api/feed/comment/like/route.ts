import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

interface LikeRequestBody {
  comment_id: string;
}

export async function POST(req: Request) {
  const { comment_id }: LikeRequestBody = await req.json();

  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase.from("comment_likes").insert([
    {
      comment_id,
      user_id: user.id,
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
