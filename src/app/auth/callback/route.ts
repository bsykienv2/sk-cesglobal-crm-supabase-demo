import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in search params, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      console.error("Lỗi trao đổi mã xác thực (Auth Callback):", error.message);
      return NextResponse.redirect(`${origin}/auth/auth-code-error?err=${encodeURIComponent(error.message)}`);
    }
  }

  // return the user to an error page with instructions
  const errorCode = searchParams.get("error_description") || "no_code_provided";
  return NextResponse.redirect(`${origin}/auth/auth-code-error?err=${encodeURIComponent(errorCode)}`);
}
