"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/learn", label: "Курс" },
  { href: "/tutor", label: "Репетитор" },
  { href: "/practice", label: "Практика" },
  { href: "/progress", label: "Прогрес" },
  { href: "/parent", label: "Батьки" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--chalk-line)] bg-[color:var(--board)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-xl tracking-wide text-[color:var(--chalk)]"
        >
          Основа
        </Link>
        <nav className="ml-auto flex items-center gap-1 overflow-x-auto text-sm">
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-md px-2.5 py-1.5 whitespace-nowrap transition-colors",
                  active
                    ? "bg-[color:var(--chalk)]/15 text-[color:var(--chalk)]"
                    : "text-[color:var(--mist)] hover:text-[color:var(--chalk)]",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
