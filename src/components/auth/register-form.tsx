"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { signUpAction, type LoginState } from "@/app/login/actions";

const initialState: LoginState = { error: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3.5 rounded-full bg-terracotta text-ivory font-bold text-[15px] shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <span className="material-symbols-outlined animate-spin text-[18px]">
            progress_activity
          </span>
          <span>Đang tạo tài khoản…</span>
        </>
      ) : (
        <span>Đăng ký tài khoản</span>
      )}
    </button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useActionState(signUpAction, initialState);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="origin" value={origin} />

      <div className="space-y-2">
        <label
          htmlFor="fullName"
          className="block text-sm font-medium text-charcoal-warm ml-1"
        >
          Họ và tên
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          required
          placeholder="Nguyễn Văn An"
          className="w-full bg-white border border-border-warm rounded-2xl py-3 px-4 text-near-black focus:ring-2 focus:ring-focus-blue focus:border-transparent outline-none transition-all"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-charcoal-warm ml-1"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="an@congty.com"
          className="w-full bg-white border border-border-warm rounded-2xl py-3 px-4 text-near-black focus:ring-2 focus:ring-focus-blue focus:border-transparent outline-none transition-all"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-charcoal-warm ml-1"
        >
          Mật khẩu
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          placeholder="••••••••"
          className="w-full bg-white border border-border-warm rounded-2xl py-3 px-4 text-near-black focus:ring-2 focus:ring-focus-blue focus:border-transparent outline-none transition-all"
        />
      </div>

      {state.error ? (
        <div 
          className={`flex items-start gap-2 px-4 py-3 rounded-2xl border text-sm ${
            state.error.includes("thành công") 
              ? "bg-[#f0fdf4] text-emerald-700 border-[#bbf7d0]" 
              : "bg-[#fdf2f2] text-error-crimson border-[#fbd5d5]"
          }`}
        >
          <span className="material-symbols-outlined text-[18px] mt-0.5">
            {state.error.includes("thành công") ? "check_circle" : "error"}
          </span>
          <span>{state.error}</span>
        </div>
      ) : null}

      <SubmitButton />
    </form>
  );
}
