"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { INTERACTION_TYPES } from "@/lib/constants";
import type {
  InteractionInsert,
  InteractionType,
} from "@/lib/types/database";

export type InteractionFormState = {
  error: string | null;
  success: boolean;
};

export async function createGlobalInteractionAction(
  _prev: InteractionFormState,
  formData: FormData,
): Promise<InteractionFormState> {
  const leadId = String(formData.get("lead_id") ?? "").trim();
  const typeRaw = String(formData.get("type") ?? "call") as InteractionType;
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim() || null;
  const occurredAtStr = String(formData.get("occurred_at") ?? "").trim();
  const durationStr = String(formData.get("duration_minutes") ?? "").trim();

  const type = INTERACTION_TYPES.includes(typeRaw) ? typeRaw : "call";
  const occurred_at = occurredAtStr
    ? new Date(occurredAtStr).toISOString()
    : new Date().toISOString();
  const duration_minutes = durationStr
    ? Number.parseInt(durationStr, 10) || null
    : null;

  if (!leadId) {
    return { error: "Vui lòng chọn khách hàng (Lead).", success: false };
  }
  if (!title) {
    return { error: "Vui lòng nhập tiêu đề.", success: false };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Phiên đã hết hạn. Đăng nhập lại.", success: false };
  }

  const insert: InteractionInsert = {
    lead_id: leadId,
    user_id: user.id,
    type,
    title,
    content,
    duration_minutes,
    occurred_at,
  };

  const { error } = await supabase.from("interactions").insert(insert);
  if (error) {
    return { error: `Không thể tạo sự kiện: ${error.message}`, success: false };
  }

  revalidatePath("/calendar");
  revalidatePath(`/leads/${leadId}`);
  return { error: null, success: true };
}

export async function updateGlobalInteractionAction(
  id: string,
  _prev: InteractionFormState,
  formData: FormData,
): Promise<InteractionFormState> {
  const leadId = String(formData.get("lead_id") ?? "").trim();
  const typeRaw = String(formData.get("type") ?? "call") as InteractionType;
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim() || null;
  const occurredAtStr = String(formData.get("occurred_at") ?? "").trim();
  const durationStr = String(formData.get("duration_minutes") ?? "").trim();

  const type = INTERACTION_TYPES.includes(typeRaw) ? typeRaw : "call";
  const occurred_at = occurredAtStr
    ? new Date(occurredAtStr).toISOString()
    : new Date().toISOString();
  const duration_minutes = durationStr
    ? Number.parseInt(durationStr, 10) || null
    : null;

  if (!title) {
    return { error: "Vui lòng nhập tiêu đề.", success: false };
  }

  const supabase = await createSupabaseServerClient();
  const updatePayload = {
    type,
    title,
    content,
    duration_minutes,
    occurred_at,
    ...(leadId ? { lead_id: leadId } : {}),
  };

  const { error } = await supabase
    .from("interactions")
    .update(updatePayload)
    .eq("id", id);

  if (error) {
    return { error: `Không thể cập nhật sự kiện: ${error.message}`, success: false };
  }

  revalidatePath("/calendar");
  revalidatePath(`/leads/${leadId}`);
  return { error: null, success: true };
}

export async function deleteGlobalInteractionAction(id: string, leadId?: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("interactions").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/calendar");
  if (leadId) revalidatePath(`/leads/${leadId}`);
}
