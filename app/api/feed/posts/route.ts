import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      user:profiles (
        username,
        avatar_url
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase posts fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
