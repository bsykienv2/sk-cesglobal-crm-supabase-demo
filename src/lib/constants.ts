import type {
  LeadStatus,
  LeadSource,
  InteractionType,
} from "@/lib/types/database";

export const LEAD_STATUSES: LeadStatus[] = [
  "new",
  "consulting",
  "won",
  "rejected",
];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Mới",
  consulting: "Đang tư vấn",
  won: "Đã mua",
  rejected: "Từ chối",
};

export const LEAD_STATUS_STYLES: Record<
  LeadStatus,
  { bg: string; text: string; ring: string; dot: string }
> = {
  new: {
    bg: "bg-[#f0f7ff]",
    text: "text-[#004e9a]",
    ring: "ring-[#d1e9ff]",
    dot: "bg-[#004e9a]",
  },
  consulting: {
    bg: "bg-[#fffbeb]",
    text: "text-[#854d0e]",
    ring: "ring-[#fde68a]",
    dot: "bg-[#d97757]",
  },
  won: {
    bg: "bg-[#e6f4ea]",
    text: "text-[#1e7e34]",
    ring: "ring-[#c3e6cb]",
    dot: "bg-[#1e7e34]",
  },
  rejected: {
    bg: "bg-[#fdf2f2]",
    text: "text-[#9b1c1c]",
    ring: "ring-[#fbd5d5]",
    dot: "bg-[#9b1c1c]",
  },
};

export const LEAD_SOURCES: LeadSource[] = [
  "facebook",
  "zalo",
  "referral",
  "google",
  "direct",
  "other",
];

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  facebook: "Facebook Ads",
  zalo: "Zalo Ads",
  referral: "Giới thiệu",
  google: "Google Search",
  direct: "Trực tiếp",
  other: "Khác",
};

export const INTERACTION_TYPES: InteractionType[] = [
  "call",
  "chat",
  "meeting",
  "email",
];

export const INTERACTION_TYPE_LABELS: Record<InteractionType, string> = {
  call: "Call",
  chat: "Chat",
  meeting: "Meeting",
  email: "Email",
};

export const INTERACTION_TYPE_ICONS: Record<InteractionType, string> = {
  call: "call",
  chat: "chat_bubble",
  meeting: "groups",
  email: "mail",
};

export const LEADS_PAGE_SIZE = 10;
