"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignOutButton } from "@/components/sign-out-button";

type Org = { id: string; name: string; slug: string; plan: string };

export function DashboardNav({ orgs }: { orgs: Org[] }) {
  const pathname = usePathname();
  const activeSlug = pathname.match(/^\/org\/([^/]+)/)?.[1];

  return (
    <header className="glass sticky top-0 z-40 border-b border-border">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Logo size="sm" href="/dashboard" />
        <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {orgs.map((org) => {
            const active = activeSlug === org.slug;
            return (
              <Link
                key={org.id}
                href={`/org/${org.slug}/knowledge`}
                className={`relative rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg bg-muted"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative flex items-center gap-1.5">
                  {org.name}
                  {org.plan === "pro" && (
                    <span className="rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-amber-600 dark:text-amber-400">
                      Pro
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SignOutButton />
        </div>
      </div>
      {orgs.length > 0 && (
        <div className="flex gap-2 overflow-x-auto border-t border-border px-4 py-2 md:hidden">
          {orgs.map((org) => (
            <Link
              key={org.id}
              href={`/org/${org.slug}/knowledge`}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                activeSlug === org.slug
                  ? "gradient-bg text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {org.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
