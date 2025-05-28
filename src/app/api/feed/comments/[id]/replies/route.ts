import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const parent_id = params.id;

  const supabase = createSupabaseClient(process.env.SUPABASE_SERVICE_ROLE_KEY!);

  const { data, error } = await supabase
    .from("comments")
    .select("*, user:users(username, avatar_url)")
    .eq("parent_id", parent_id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Failed to load replies" }, { status: 500 });
  }

  return NextResponse.json(data);
}
