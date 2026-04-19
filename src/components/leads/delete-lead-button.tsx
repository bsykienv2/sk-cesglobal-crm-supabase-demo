"use client";

import { useState, useTransition } from "react";
import { deleteLeadAction } from "@/app/(dashboard)/leads/actions";

export function DeleteLeadButton({ leadId, iconOnly }: { leadId: string; iconOnly?: boolean }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        title="Xóa"
        className={
          iconOnly
            ? "p-1.5 text-stone-gray hover:text-error-crimson hover:bg-error-crimson/5 rounded-lg transition-colors flex items-center"
            : "px-5 py-2 border border-error-crimson/20 text-error-crimson rounded-full text-[14px] font-medium hover:bg-error-crimson/5 transition-all flex items-center gap-2"
        }
      >
        <span className={`material-symbols-outlined ${iconOnly ? "text-[20px]" : "text-[18px]"}`}>delete</span>
        {!iconOnly && "Xóa"}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-error-crimson font-medium">
        Xác nhận xóa?
      </span>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await deleteLeadAction(leadId);
          })
        }
        className="px-4 py-2 bg-error-crimson text-ivory rounded-full text-xs font-medium hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Đang xóa…" : "Xóa"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="px-4 py-2 border border-border-warm text-olive-gray rounded-full text-xs font-medium hover:bg-warm-sand"
      >
        Hủy
      </button>
    </div>
  );
}
