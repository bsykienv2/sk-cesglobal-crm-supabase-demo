import Link from "next/link";
import { getInitials } from "@/lib/utils";

type TopbarProps = {
  title?: string;
  userEmail: string;
  userName?: string | null;
  avatarUrl?: string | null;
};

export function Topbar({ title, userEmail, userName, avatarUrl }: TopbarProps) {
  const displayName = userName?.trim() || userEmail;
  const initials = getInitials(displayName);

  return (
    <header className="sticky top-0 z-40 w-full flex items-center gap-4 px-6 py-4 bg-parchment border-b border-border-cream">
      <div className="md:hidden">
        <span className="material-symbols-outlined text-near-black">menu</span>
      </div>

      {title ? (
        <h2 className="font-headline text-xl md:text-2xl font-medium tracking-tight text-near-black">
          {title}
        </h2>
      ) : (
        <h2 className="font-headline text-xl font-medium tracking-tight text-near-black md:hidden">
          CRM Pro
        </h2>
      )}

      <div className="hidden md:flex relative flex-1 max-w-sm ml-6">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-gray text-sm">
          search
        </span>
        <input
          type="text"
          placeholder="Tìm kiếm lead…"
          className="w-full pl-10 pr-4 py-1.5 bg-warm-sand border-none rounded-full text-sm placeholder:text-warm-silver focus:ring-1 focus:ring-focus-blue outline-none transition-all"
        />
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <Link
          href="/leads/new"
          className="flex items-center gap-2 px-5 py-2 bg-terracotta text-ivory rounded-full text-sm font-medium hover:opacity-90 active:scale-95 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span className="hidden sm:inline">Thêm Lead</span>
        </Link>

        <div className="flex items-center gap-3 ml-1 border-l border-border-cream pl-4">
          <button
            type="button"
            aria-label="Notifications"
            className="p-2 text-olive-gray hover:text-near-black hover:bg-warm-sand rounded-full transition-colors relative"
          >
            <span className="material-symbols-outlined text-[20px]">
              notifications
            </span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-terracotta rounded-full border-2 border-parchment" />
          </button>
          <button
            type="button"
            aria-label="Settings"
            className="p-2 text-olive-gray hover:text-near-black hover:bg-warm-sand rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              settings
            </span>
          </button>
          <div
            className="w-9 h-9 rounded-full overflow-hidden bg-warm-sand ring-1 ring-border-cream flex items-center justify-center"
            title={displayName}
          >
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-headline text-[13px] font-medium text-terracotta">
                {initials}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
