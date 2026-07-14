"use client";

import Link from "next/link";
import { useState } from "react";

const CHOICES = [
  { id: "join-college", label: "Join my College Community", href: "/colleges" },
  { id: "explore-lead", label: "Explore a campus leadership position", href: "/colleges" },
  { id: "vr-team", label: "Join the voter-registration team", href: "/colleges" },
  { id: "events-team", label: "Join the social and events team", href: "/colleges" },
  { id: "social-media", label: "Join the social media team", href: "/colleges" },
  { id: "outreach", label: "Join outreach and recruitment", href: "/colleges" },
  { id: "volunteer-support", label: "Join volunteer support", href: "/colleges" },
  { id: "data", label: "Join data and follow-up", href: "/colleges" },
  { id: "p5", label: "Build my Power of 5", href: "/orientation/power-of-5" },
  { id: "invite", label: "Invite someone from my school", href: "/join" },
  { id: "event", label: "Help plan the networking event", href: "/colleges" },
  { id: "conversation", label: "Schedule a leadership conversation", href: "/join/interest" },
  { id: "county", label: "Continue through the County path", href: "/orientation/community" },
  { id: "learn", label: "Learn more before choosing", href: "/how-it-works" },
] as const;

export default function OrientationNextStepPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const choice = CHOICES.find((c) => c.id === selected) ?? null;

  function pick(id: string) {
    setSelected(id);
    try {
      const key = "orientation-next-step-v1";
      const prev = JSON.parse(localStorage.getItem(key) || "[]") as unknown[];
      localStorage.setItem(key, JSON.stringify([{ id, at: new Date().toISOString() }, ...prev].slice(0, 50)));
    } catch {
      /* soft beta */
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-xl">
        <Link href="/orientation" className="text-xs font-semibold text-brand-700">
          ← Return to Orientation
        </Link>
        <h1 className="mt-4 text-3xl font-bold">Choose one next step</h1>
        <p className="mt-2 text-sm text-slate-600">
          This records soft-beta interest in this browser. It does not appoint you to a leadership position.
        </p>
        <ul className="mt-6 space-y-2">
          {CHOICES.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => pick(c.id)}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold ${
                  selected === c.id ? "border-brand-600 bg-brand-50 text-brand-950" : "bg-white"
                }`}
              >
                {c.label}
              </button>
            </li>
          ))}
        </ul>
        {choice ? (
          <div className="mt-6 rounded-xl border border-brand-200 bg-white p-4">
            <p className="text-xs font-bold uppercase text-brand-700">Selected</p>
            <p className="mt-1 font-semibold">{choice.label}</p>
            <Link href={choice.href} className="mt-3 inline-block rounded-lg bg-brand-700 px-4 py-2 text-sm font-bold text-white">
              Go →
            </Link>
            <Link href="/orientation/complete" className="mt-2 block text-sm font-semibold text-brand-700 underline">
              Mark Orientation complete
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
