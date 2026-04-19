"use client";

import { useState, useTransition } from "react";
import { deleteGlobalInteractionAction } from "@/app/(dashboard)/calendar/actions";

export function DeleteInteractionButton({ id, leadId }: { id: string; leadId?: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        title="Xóa sự kiện"
        className="p-1.5 text-stone-gray hover:text-error-crimson bg-white hover:bg-error-crimson/10 border border-border-cream rounded-lg transition-colors flex items-center justify-center shrink-0"
      >
        <span className="material-symbols-outlined text-[18px]">delete</span>
      </button>
    );
  }

  return (
    <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm shadow-md border border-border-cream rounded-xl p-3 z-20 flex flex-col gap-2">
      <span className="text-xs text-error-crimson font-medium text-center">
        Thu hồi sự kiện / ghi chú này?
      </span>
      <div className="flex items-center gap-2 mt-1">
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await deleteGlobalInteractionAction(id, leadId);
            })
          }
          className="flex-1 px-3 py-1.5 bg-error-crimson text-ivory rounded-full text-xs font-medium hover:opacity-90 disabled:opacity-60 transition-all text-center"
        >
          {pending ? "Đang xóa…" : "Xóa"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="flex-1 px-3 py-1.5 border border-border-warm text-olive-gray rounded-full text-xs font-medium hover:bg-warm-sand transition-all text-center"
        >
          Hủy
        </button>
      </div>
    </div>
  );
}
