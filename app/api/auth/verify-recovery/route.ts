import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

interface RecoveryPayload {
  email: string;
  token: string;
  type: string;
}

export async function POST(req: Request) {
  const body: RecoveryPayload = await req.json();

  const supabase = createServerComponentClient({ cookies });

  const { error: signInError } = await supabase.auth.verifyOtp({
    email: body.email,
    token: body.token,
    type: body.type as "recovery",
  });

  if (signInError) {
    return NextResponse.json({ error: signInError.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Recovery verified successfully" });
}
