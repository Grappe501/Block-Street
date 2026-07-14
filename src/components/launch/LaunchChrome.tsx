"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PLATFORM } from "@/lib/data";

type Place = { kind: string; slug: string; name: string } | null;

type NavItem = { href: string; label: string; primary?: boolean };

function navFor(stage: "guest" | "choose" | "member" | "admin"): NavItem[] {
  if (stage === "guest") {
    return [
      { href: "/join", label: "Join", primary: true },
      { href: "/login", label: "Sign in" },
    ];
  }
  if (stage === "choose") {
    return [{ href: "/choose-place", label: "Choose your place", primary: true }];
  }
  if (stage === "admin") {
    return [
      { href: "/network", label: "Network", primary: true },
      { href: "/start", label: "Invite" },
      { href: "/july-14", label: "Tonight" },
    ];
  }
  return [
    { href: "/network", label: "Network", primary: true },
    { href: "/july-14", label: "Tonight" },
  ];
}

export function LaunchHeader() {
  const [stage, setStage] = useState<"guest" | "choose" | "member" | "admin">("guest");
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const sessionRes = await fetch("/api/auth/session");
        if (!sessionRes.ok) {
          if (!cancelled) setStage("guest");
          return;
        }
        const sessionData = await sessionRes.json();
        if (!sessionData.authenticated) {
          if (!cancelled) setStage("guest");
          return;
        }
        const email = sessionData.profile?.primary_email as string | undefined;
        const display = (sessionData.profile?.preferred_name || sessionData.profile?.display_name) as string | undefined;
        if (!cancelled) setName(display ?? null);

        const placeRes = await fetch("/api/launch/home-place");
        const placeData = (await placeRes.json()) as { place: Place };
        const isAdmin = email === "grappe4arkansas@gmail.com" || email === "director@block-street.local";

        if (!placeData.place && !isAdmin) {
          if (!cancelled) setStage("choose");
          return;
        }
        if (!cancelled) setStage(isAdmin ? "admin" : "member");
      } catch {
        if (!cancelled) setStage("guest");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const items = navFor(stage);

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 pr-36 sm:pr-48">
        <Link href={stage === "guest" ? "/" : "/app"} className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-xs font-bold text-white">
            {PLATFORM.workingName.slice(0, 2)}
          </span>
          <span className="text-base font-bold text-slate-900">{PLATFORM.workingName}</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm font-medium">
          {name && <span className="hidden text-slate-500 lg:inline">{name}</span>}
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                item.primary
                  ? "rounded-lg bg-brand-700 px-3 py-1.5 text-white hover:bg-brand-800"
                  : "rounded-lg px-2 py-1.5 text-slate-600 hover:text-brand-700"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function LaunchFooter() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-6 text-center text-xs text-slate-500">
        Block Street · Invitation-only · Arkansas youth organizing
      </div>
    </footer>
  );
}
