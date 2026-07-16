"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { PersonalHome } from "@/lib/person-home/types";

export function PersonalHomeShell() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const panel = searchParams.get("panel");
  const [home, setHome] = useState<PersonalHome | null>(null);
  const [error, setError] = useState("");
  const [showLeadershipLinks, setShowLeadershipLinks] = useState(false);

  useEffect(() => {
    (async () => {
      const session = await fetch("/api/auth/session");
      if (!session.ok) {
        router.replace("/login?next=/home");
        return;
      }
      const sessionData = await session.json();
      const email = sessionData.profile?.primary_email as string | undefined;
      const isOperator =
        email === "grappe4arkansas@gmail.com" || email === "director@block-street.local";
      setShowLeadershipLinks(isOperator);
      const res = await fetch("/api/home");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not load home");
        return;
      }
      setHome(data.home as PersonalHome);
    })();
  }, [router]);

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <p className="text-red-700" role="alert">{error}</p>
      </div>
    );
  }

  if (!home) {
    return <div className="mx-auto max-w-2xl px-4 py-16 text-center text-slate-500">Loading your home…</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <header className="rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Your home</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Welcome, {home.welcome_name}</h1>
        <p className="mt-2 text-sm text-slate-600">
          Your organizing home — what is happening, what you can do next, and who is nearby.
        </p>
      </header>

      {home.next_action && (
        <section className="mt-6 rounded-2xl border-2 border-brand-500 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Your next action</p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">{home.next_action.title}</h2>
          <p className="mt-2 text-sm text-slate-600">{home.next_action.description}</p>
          {home.next_action.href && (
            <Link href={home.next_action.href} className="mt-4 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
              Continue
            </Link>
          )}
        </section>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <HomeCard title="Your place" body={placeSummary(home)} href={home.links.choose_place} />
        <HomeCard title="Your role" body={roleSummary(home)} />
        <HomeCard title="Next meeting" body={meetingSummary(home)} href={home.links.calendar} />
        <HomeCard title="Your team" body={`${home.people_to_know.length} contact${home.people_to_know.length === 1 ? "" : "s"} to know`} href="/network" />
      </div>

      {(panel === "onboarding" || home.onboarding_stage === "profile_complete") && (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-slate-900">Get to know you</h2>
          <p className="mt-1 text-sm text-slate-600">Warm prompts — not political, not personality scoring. This helps Outreach suggest a committee lane.</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
            <li>What kind of work do you enjoy?</li>
            <li>Talking with people, organizing details, creating content, or behind the scenes?</li>
            <li>From home, in person, or both?</li>
            <li>How much time would you realistically like to give?</li>
          </ul>
          <p className="mt-3 text-xs text-slate-500">More questions will appear here as you get settled in.</p>
        </section>
      )}

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold text-slate-900">Committee board</h2>
        {home.committee_messages.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">No committee posts yet. Once you are placed, announcements and meeting updates appear here.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {home.committee_messages.map((post) => (
              <li key={post.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm">
                <p className="font-semibold text-slate-900">{post.title}</p>
                <p className="text-slate-600">{post.excerpt}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link href={home.links.network} className="text-brand-700 underline">My people</Link>
        <Link href={home.links.calendar} className="text-brand-700 underline">Calendar</Link>
        {showLeadershipLinks && (
          <Link href="/command/outreach" className="text-brand-700 underline">Outreach</Link>
        )}
      </footer>
    </div>
  );
}

function HomeCard({ title, body, href }: { title: string; body: string; href?: string }) {
  const inner = (
    <>
      <h3 className="font-bold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{body}</p>
    </>
  );
  if (href) {
    return (
      <Link href={href} className="block rounded-xl border border-slate-200 bg-white p-4 hover:border-brand-300">
        {inner}
      </Link>
    );
  }
  return <div className="rounded-xl border border-slate-200 bg-white p-4">{inner}</div>;
}

function placeSummary(home: PersonalHome): string {
  if (!home.place) return "Choose your county or campus to connect locally.";
  const parts = [home.place.county, home.place.cluster, home.place.institution, home.place.committee_name].filter(Boolean);
  return parts.join(" · ") || "Place committed";
}

function roleSummary(home: PersonalHome): string {
  if (!home.role) return "Volunteer role pending placement.";
  return `${home.role.title} · ${home.role.participation_type}`;
}

function meetingSummary(home: PersonalHome): string {
  if (!home.next_meeting) return "Meetings appear after placement.";
  return `${home.next_meeting.title} · ${new Date(home.next_meeting.starts_at).toLocaleDateString()}`;
}
