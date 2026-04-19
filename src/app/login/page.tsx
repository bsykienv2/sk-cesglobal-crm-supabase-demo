import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";

export const metadata: Metadata = {
  title: "Đăng nhập • CRM Pro",
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;
  return (
    <main className="min-h-screen flex items-center justify-center bg-parchment px-4 py-12">
      <div className="w-full max-w-[800px]">
        <div className="text-center mb-10">
          <h1 className="font-headline text-4xl font-medium text-terracotta tracking-tight">
            CRM Pro
          </h1>
          <p className="text-xs uppercase tracking-[0.2em] text-stone-gray mt-2">
            Sales Intelligence
          </p>
        </div>

        <div className="bg-ivory border border-border-cream rounded-[32px] p-8 md:p-12 whisper-shadow">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Cột trái: Đăng nhập Email */}
            <div className="flex-1">
              <div className="mb-8">
                <h2 className="font-headline text-2xl font-medium text-near-black leading-tight">
                  Chào mừng trở lại.
                </h2>
                <p className="text-sm text-olive-gray mt-2 leading-relaxed">
                  Đăng nhập để tiếp tục quản lý hành trình khách hàng của bạn.
                </p>
              </div>
              <LoginForm next={next ?? "/"} />
            </div>

            {/* Vạch ngăn cách (Desktop dọc, Mobile ngang) */}
            <div className="hidden md:flex flex-col items-center justify-center">
              <div className="flex-1 w-px bg-border-warm opacity-60"></div>
              <span className="py-4 text-xs tracking-widest text-stone-gray uppercase font-medium">Hoặc</span>
              <div className="flex-1 w-px bg-border-warm opacity-60"></div>
            </div>
            
            <div className="md:hidden relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-warm opacity-60"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-ivory px-4 text-stone-gray tracking-widest font-medium">
                  Hoặc
                </span>
              </div>
            </div>

            {/* Cột phải: Đăng nhập Google & Đăng ký */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="mb-8 text-center md:text-left">
                <h3 className="font-headline text-xl font-medium text-near-black">
                  Đăng nhập nhanh
                </h3>
                <p className="text-sm text-olive-gray mt-2">
                  Sử dụng tài khoản Google Workspace (Email công ty) để truy cập không cần mật khẩu.
                </p>
              </div>

              <GoogleAuthButton />

              <div className="mt-8 pt-6 border-t border-border-warm border-dashed text-center">
                <p className="text-sm text-olive-gray">
                  Chưa có tài khoản?{" "}
                  <Link
                    href="/register"
                    className="text-terracotta font-medium hover:underline underline-offset-4"
                  >
                    Đăng ký ngay
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-stone-gray mt-8 italic font-headline">
          &ldquo;Sự tận tâm trong từng chi tiết là chìa khóa của niềm tin.&rdquo;
        </p>
      </div>
    </main>
  );
}
