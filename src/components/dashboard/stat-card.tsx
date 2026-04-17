import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: number | string;
  icon: string;
  tone: "hot" | "active" | "success" | "muted";
  hint?: string;
};

const TONES: Record<
  StatCardProps["tone"],
  { bg: string; icon: string; badge?: string; badgeText?: string; hint: string }
> = {
  hot: {
    bg: "bg-[#fefce8]",
    icon: "text-[#a16207]",
    badge: "bg-[#fefce8] text-[#a16207]",
    badgeText: "Hot",
    hint: "text-[#15803d]",
  },
  active: {
    bg: "bg-[#ecfdf5]",
    icon: "text-[#047857]",
    hint: "text-stone-gray",
  },
  success: {
    bg: "bg-[#eff6ff]",
    icon: "text-[#1d4ed8]",
    hint: "text-[#1d4ed8]",
  },
  muted: {
    bg: "bg-[#fef2f2]",
    icon: "text-[#b91c1c]",
    hint: "text-stone-gray",
  },
};

export function StatCard({ label, value, icon, tone, hint }: StatCardProps) {
  const t = TONES[tone];
  return (
    <div className="bg-ivory p-6 rounded-2xl ring-shadow whisper-shadow hover:shadow-ring-deep transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2 rounded-xl", t.bg)}>
          <span className={cn("material-symbols-outlined", t.icon)}>
            {icon}
          </span>
        </div>
        {t.badgeText ? (
          <span
            className={cn(
              "text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full",
              t.badge,
            )}
          >
            {t.badgeText}
          </span>
        ) : null}
      </div>
      <p className="text-[15px] font-medium text-olive-gray mb-1">{label}</p>
      <h3 className="font-headline text-3xl font-medium text-near-black">
        {value}
      </h3>
      {hint ? (
        <div
          className={cn("mt-4 text-[12px] flex items-center gap-1", t.hint)}
        >
          <span>{hint}</span>
        </div>
      ) : null}
    </div>
  );
}
