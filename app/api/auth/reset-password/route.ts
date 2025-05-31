import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

interface ResetPasswordPayload {
  password: string;
}

export async function POST(req: Request) {
  const { password }: ResetPasswordPayload = await req.json();

  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Password updated successfully" });
}
