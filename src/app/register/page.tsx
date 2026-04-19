import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";

export const metadata: Metadata = {
  title: "Đăng ký tài khoản • CRM Pro",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-parchment px-4 py-12">
      <div className="w-full max-w-[440px]">
        <div className="text-center mb-10">
          <h1 className="font-headline text-4xl font-medium text-terracotta tracking-tight">
            CRM Pro
          </h1>
          <p className="text-xs uppercase tracking-[0.2em] text-stone-gray mt-2">
            Sales Intelligence
          </p>
        </div>

        <div className="bg-ivory border border-border-cream rounded-[32px] p-8 md:p-10 whisper-shadow">
          <div className="mb-8">
            <h2 className="font-headline text-2xl font-medium text-near-black leading-tight">
              Tạo tài khoản mới.
            </h2>
            <p className="text-sm text-olive-gray mt-2 leading-relaxed">
              Bắt đầu hành trình quản lý khách hàng chuyên nghiệp ngay hôm nay.
            </p>
          </div>

          <RegisterForm />

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-warm opacity-60"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-ivory px-4 text-stone-gray tracking-widest font-medium">
                Hoặc đăng ký nhanh với
              </span>
            </div>
          </div>

          <GoogleAuthButton />

          <div className="mt-8 pt-6 border-t border-border-warm border-dashed text-center">
            <p className="text-sm text-olive-gray">
              Đã có tài khoản?{" "}
              <Link
                href="/login"
                className="text-terracotta font-medium hover:underline underline-offset-4"
              >
                Đăng nhập tại đây
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-stone-gray mt-8 italic font-headline">
          &ldquo;Gieo niềm tin, gặt hái thành công bền vững.&rdquo;
        </p>
      </div>
    </main>
  );
}
