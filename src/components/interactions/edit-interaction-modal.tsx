"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import {
  updateGlobalInteractionAction,
  type InteractionFormState,
} from "@/app/(dashboard)/calendar/actions";
import {
  INTERACTION_TYPES,
  INTERACTION_TYPE_LABELS,
  INTERACTION_TYPE_ICONS,
} from "@/lib/constants";
import type { Interaction, InteractionType } from "@/lib/types/database";
import { cn } from "@/lib/utils";

const initialState: InteractionFormState = { error: null, success: false };

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-8 py-2 rounded-full font-medium text-ivory bg-terracotta ring-1 ring-terracotta hover:opacity-90 transition-all active:scale-95 text-sm disabled:opacity-60"
    >
      {pending ? "Đang lưu…" : "Cập nhật"}
    </button>
  );
}

export function EditInteractionModal({
  interaction,
  leads, // Optional: if we want to allow changing leads, but usually we just keep existing lead_id
}: {
  interaction: Interaction;
  leads?: { id: string; full_name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<InteractionType>(interaction.type || "call");
  const [, startTransition] = useTransition();
  const router = useRouter();

  const boundAction = updateGlobalInteractionAction.bind(null, interaction.id);
  const [state, formAction] = useActionState(boundAction, initialState);

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      startTransition(() => router.refresh());
    }
  }, [state.success, router]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Convert postgres timestamp to datetime-local format
  const getLocalDatetime = (isoStr: string) => {
    if (!isoStr) return "";
    const dateStr = new Date(isoStr).toISOString().slice(0, 16);
    return dateStr;
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Sửa sự kiện"
        className="p-1.5 text-stone-gray hover:text-focus-blue bg-white hover:bg-pale-cyan border border-border-cream rounded-lg transition-colors flex items-center justify-center shrink-0"
      >
        <span className="material-symbols-outlined text-[18px]">edit</span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-near-black/40 backdrop-blur-sm p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-ivory w-full max-w-[520px] rounded-2xl whisper-shadow border border-border-cream overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="px-6 py-4 flex items-center justify-between border-b border-border-cream">
              <h2 className="font-headline text-xl font-medium text-near-black">
                Cập nhật Sự Kiện / Ghi Chú
              </h2>
              <button
                type="button"
                aria-label="Đóng"
                onClick={() => setOpen(false)}
                className="material-symbols-outlined text-stone-gray hover:text-near-black transition-colors p-1 rounded-full hover:bg-warm-sand"
              >
                close
              </button>
            </div>

            <form
              action={formAction}
              className="flex flex-col flex-1 overflow-y-auto"
            >
              <input type="hidden" name="type" value={type} />
              <input type="hidden" name="lead_id" value={interaction.lead_id} />

              <div className="p-6 space-y-6 text-left">
                {leads && leads.length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-charcoal-warm">
                      Khách hàng (Lead)
                    </label>
                    <select
                      name="lead_id"
                      required
                      defaultValue={interaction.lead_id}
                      className="w-full bg-white border border-border-warm rounded-lg text-near-black focus:ring-2 focus:ring-focus-blue focus:border-transparent p-3 text-sm outline-none transition-all cursor-pointer"
                    >
                      {leads.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.full_name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-charcoal-warm">
                    Loại tương tác
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {INTERACTION_TYPES.map((t) => {
                      const active = t === type;
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setType(t)}
                          className={cn(
                            "flex flex-col items-center justify-center gap-1 p-3 rounded-lg transition-all border",
                            active
                              ? "border-terracotta bg-parchment ring-1 ring-terracotta"
                              : "border-border-warm bg-ivory hover:bg-warm-sand",
                          )}
                        >
                          <span
                            className={cn(
                              "material-symbols-outlined",
                              active
                                ? "text-terracotta filled"
                                : "text-stone-gray",
                            )}
                          >
                            {INTERACTION_TYPE_ICONS[t]}
                          </span>
                          <span
                            className={cn(
                              "text-[10px] font-medium",
                              active ? "text-terracotta" : "text-stone-gray",
                            )}
                          >
                            {INTERACTION_TYPE_LABELS[t]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-charcoal-warm">
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={interaction.title}
                    placeholder="Ví dụ: Cuộc gọi tư vấn lần 1"
                    className="w-full bg-white border border-border-warm rounded-lg text-near-black focus:ring-2 focus:ring-focus-blue focus:border-transparent placeholder-warm-silver p-3 text-sm outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-charcoal-warm">
                    Nội dung
                  </label>
                  <textarea
                    name="content"
                    rows={4}
                    defaultValue={interaction.content ?? ""}
                    placeholder="Nhập chi tiết cuộc trò chuyện…"
                    className="w-full bg-white border border-border-warm rounded-lg text-near-black focus:ring-2 focus:ring-focus-blue focus:border-transparent placeholder-warm-silver p-3 text-sm resize-none outline-none transition-all"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <label className="block text-[10px] uppercase tracking-widest text-stone-gray">
                      Thời điểm
                    </label>
                    <input
                      type="datetime-local"
                      name="occurred_at"
                      defaultValue={getLocalDatetime(interaction.occurred_at)}
                      className="w-full bg-parchment border-none rounded-full py-2 px-4 text-xs font-medium ring-1 ring-border-warm"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="block text-[10px] uppercase tracking-widest text-stone-gray">
                      Thời lượng (phút)
                    </label>
                    <input
                      type="number"
                      name="duration_minutes"
                      min={0}
                      defaultValue={interaction.duration_minutes ?? ""}
                      placeholder="15"
                      className="w-full bg-parchment border-none rounded-full py-2 px-4 text-xs font-medium ring-1 ring-border-warm"
                    />
                  </div>
                </div>

                {state.error ? (
                  <div className="flex items-start gap-2 px-4 py-3 bg-[#fdf2f2] text-error-crimson rounded-lg border border-[#fbd5d5] text-sm">
                    <span className="material-symbols-outlined text-[18px] mt-0.5">
                      error
                    </span>
                    <span>{state.error}</span>
                  </div>
                ) : null}
              </div>

              <div className="px-6 py-4 bg-parchment flex items-center justify-end gap-3 border-t border-border-cream mt-auto">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-6 py-2 rounded-full font-medium text-charcoal-warm bg-transparent hover:bg-warm-sand transition-all text-sm"
                >
                  Hủy
                </button>
                <SaveButton />
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
