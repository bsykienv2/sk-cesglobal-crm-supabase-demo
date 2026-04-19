import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lỗi xác thực • CRM Pro",
};

export default function AuthCodeErrorPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-parchment px-4 py-12">
      <div className="w-full max-w-[440px]">
        <div className="text-center mb-10">
          <h1 className="font-headline text-4xl font-medium text-terracotta tracking-tight">
            CRM Pro
          </h1>
        </div>

        <div className="bg-ivory border border-border-cream rounded-[32px] p-8 md:p-10 whisper-shadow text-center">
          <div className="mb-8">
            <span className="material-symbols-outlined text-[64px] text-error-crimson mb-4">
              heart_broken
            </span>
            <h2 className="font-headline text-2xl font-medium text-near-black leading-tight">
              Xác thực thất bại.
            </h2>
            <p className="text-sm text-olive-gray mt-4 leading-relaxed">
              Máy chủ không thể hoàn tất quá trình đăng nhập. Điều này có thể do mã xác thực đã hết hạn hoặc thông tin đăng nhập từ Google không hợp lệ.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/login"
              className="block w-full py-3 rounded-full bg-terracotta text-ivory font-medium text-sm shadow-sm hover:opacity-95 active:scale-[0.98] transition-all"
            >
              Thử đăng nhập lại
            </Link>
            
            <Link
              href="/register"
              className="block w-full py-3 rounded-full border border-border-warm bg-white text-near-black font-medium text-sm shadow-sm hover:bg-ivory active:scale-[0.98] transition-all"
            >
              Tạo tài khoản mới
            </Link>
          </div>

          <p className="text-xs text-stone-gray mt-8 italic">
            Nếu lỗi vẫn tiếp diễn, vui lòng liên hệ quản trị viên để được hỗ trợ.
          </p>
        </div>
      </div>
    </main>
  );
}
