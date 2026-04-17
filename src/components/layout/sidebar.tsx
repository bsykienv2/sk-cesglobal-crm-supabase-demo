"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/app/login/actions";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  icon: string;
  label: string;
  matches?: (pathname: string) => boolean;
};

const NAV: NavItem[] = [
  { href: "/", icon: "dashboard", label: "Dashboard", matches: (p) => p === "/" },
  {
    href: "/leads",
    icon: "group",
    label: "Leads",
    matches: (p) => p === "/leads" || p.startsWith("/leads/"),
  },
  { href: "/calendar", icon: "calendar_today", label: "Calendar" },
  { href: "/reports", icon: "analytics", label: "Reports" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 sticky top-0 bg-ivory border-r border-border-cream py-6 px-4 gap-4">
      <div className="mb-6 px-2">
        <h1 className="font-headline text-xl font-medium text-terracotta">
          CRM Pro
        </h1>
        <p className="text-xs text-stone-gray uppercase tracking-[0.2em] mt-1">
          Sales Intelligence
        </p>
      </div>

      <nav className="flex flex-col gap-1 flex-grow">
        {NAV.map((item) => {
          const active = item.matches
            ? item.matches(pathname)
            : pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-full transition-all duration-200 text-[15px]",
                active
                  ? "bg-warm-sand text-near-black font-medium ring-shadow-deep"
                  : "text-olive-gray hover:bg-border-cream hover:text-near-black",
              )}
            >
              <span
                className={cn(
                  "material-symbols-outlined text-lg",
                  active && "filled",
                )}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1 pt-6 border-t border-border-cream">
        <Link
          href="/help"
          className="flex items-center gap-3 px-4 py-2 text-olive-gray hover:text-near-black transition-colors text-sm"
        >
          <span className="material-symbols-outlined text-lg">help_outline</span>
          <span>Help</span>
        </Link>
        <form action={signOutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-4 py-2 text-olive-gray hover:text-near-black transition-colors text-sm"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            <span>Logout</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
