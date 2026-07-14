"use client";

import { useState } from "react";
import Link from "next/link";

const AREAS = [
  "Invitation / sign-in",
  "Choosing my school or county",
  "My Network board",
  "College / campus roles",
  "Field Manual / presentations",
  "July 14 / Tonight",
  "Director or command boards",
  "Something else",
];

type Sentiment = "loved" | "mixed" | "frustrated";

export default function BetaFeedbackPage() {
  const [sentiment, setSentiment] = useState<Sentiment | "">("");
  const [areas, setAreas] = useState<string[]>([]);
  const [whatWorked, setWhatWorked] = useState("");
  const [whatHurt, setWhatHurt] = useState("");
  const [request, setRequest] = useState("");
  const [place, setPlace] = useState("");
  const [contactOk, setContactOk] = useState(true);
  const [loading, setLoading] = useState(false);
  const [doneId, setDoneId] = useState<string | null>(null);
  const [error, setError] = useState("");

  function toggleArea(a: string) {
    setAreas((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!sentiment) {
      setError("Tell us how the beta felt overall.");
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch("/api/beta/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sentiment,
        areas,
        what_worked: whatWorked,
        what_hurt: whatHurt,
        request,
        campus_or_place: place,
        contact_ok: contactOk,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Could not send feedback — try again.");
      return;
    }
    setDoneId(String(data.id ?? "ok"));
  }

  if (doneId) {
    return (
      <div className="mx-auto max-w-xl px-4 py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">Beta partnership</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Thank you</h1>
        <p className="mt-3 text-slate-700">
          We build with you — not at you. Your note is in our beta feedback queue
          {doneId !== "ok" ? ` (${doneId})` : ""}.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <Link href="/network" className="rounded-lg bg-brand-700 px-4 py-2 font-semibold text-white">
            Back to Network
          </Link>
          <Link href="/presentations/college" className="rounded-lg border border-slate-300 px-4 py-2 font-semibold">
            College presentation
          </Link>
          <button
            type="button"
            className="rounded-lg border border-slate-300 px-4 py-2 font-semibold"
            onClick={() => {
              setDoneId(null);
              setWhatWorked("");
              setWhatHurt("");
              setRequest("");
              setAreas([]);
              setSentiment("");
            }}
          >
            Send another note
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">Beta partnership</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Tell us how it’s going</h1>
      <p className="mt-3 text-base leading-relaxed text-slate-700">
        You’re on the soft-beta team. Praise what works. Name friction honestly. Ask for what your campus needs.
        We read every submission.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-8">
        <fieldset>
          <legend className="text-sm font-semibold text-slate-900">Overall, this beta has felt…</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {(
              [
                ["loved", "Encouraging"],
                ["mixed", "Mixed"],
                ["frustrated", "Frustrating"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setSentiment(id)}
                className={`rounded-xl border px-3 py-3 text-left text-sm font-semibold transition ${
                  sentiment === id
                    ? "border-brand-600 bg-brand-50 text-brand-950"
                    : "border-slate-200 bg-white text-slate-800 hover:border-slate-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold text-slate-900">What were you using?</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {AREAS.map((a) => {
              const on = areas.includes(a);
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleArea(a)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                    on ? "border-brand-600 bg-brand-700 text-white" : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  {a}
                </button>
              );
            })}
          </div>
        </fieldset>

        <label className="block text-sm font-semibold text-slate-900">
          What worked well?
          <textarea
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-normal text-slate-900"
            rows={3}
            value={whatWorked}
            onChange={(e) => setWhatWorked(e.target.value)}
            placeholder="Moments that felt clear, valuable, or worth inviting someone into…"
          />
        </label>

        <label className="block text-sm font-semibold text-slate-900">
          What hurt or confused you?
          <textarea
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-normal text-slate-900"
            rows={3}
            value={whatHurt}
            onChange={(e) => setWhatHurt(e.target.value)}
            placeholder="Broken steps, jargon, missing pieces, unfair surprises…"
          />
        </label>

        <label className="block text-sm font-semibold text-slate-900">
          Requests or recommendations
          <textarea
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-normal text-slate-900"
            rows={3}
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            placeholder="Features, copy changes, campus tools, role clarity…"
          />
        </label>

        <label className="block text-sm font-semibold text-slate-900">
          Campus or place (optional)
          <input
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="e.g. Henderson State · Benton County"
          />
        </label>

        <label className="flex items-start gap-2 text-sm text-slate-800">
          <input
            type="checkbox"
            className="mt-1"
            checked={contactOk}
            onChange={(e) => setContactOk(e.target.checked)}
          />
          <span>It’s OK to follow up with me if I’m signed in (we only store email when you opt in).</span>
        </label>

        {error && (
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60"
        >
          {loading ? "Sending…" : "Send feedback to the build team"}
        </button>
      </form>

      <p className="mt-8 text-center text-xs text-slate-500">
        Soft beta · invitation-only ·{" "}
        <Link href="/presentations/college" className="underline">
          College walkthrough
        </Link>
      </p>
    </div>
  );
}
