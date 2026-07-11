"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function NotificationPreferences() {
  const [preferences, setPreferences] = useState<Record<string, unknown>[]>([]);
  const [quietHours, setQuietHours] = useState<Record<string, unknown> | null>(null);
  const [consents, setConsents] = useState<Record<string, unknown>[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/notifications/preferences").then((r) => r.json()).then((d) => setPreferences(d.preferences ?? []));
    fetch("/api/notifications/quiet-hours").then((r) => r.json()).then((d) => setQuietHours(d.quiet_hours));
    fetch("/api/notifications/consents").then((r) => r.json()).then((d) => setConsents(d.consents ?? []));
  }, []);

  async function saveQuietHours() {
    if (!quietHours) return;
    const res = await fetch("/api/notifications/quiet-hours", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quietHours),
    });
    const data = await res.json();
    setQuietHours(data.quiet_hours);
    setMsg("Quiet hours saved.");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-950">Notification Preferences</h1>
        <Link href="/notifications" className="text-sm font-semibold text-blue-700 hover:underline">
          Back to notifications
        </Link>
      </div>
      {msg && <p className="text-sm text-emerald-800">{msg}</p>}

      <section className="card border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-bold text-slate-950">Quiet Hours</h2>
        {quietHours && (
          <div className="mt-3 grid gap-2 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!quietHours.enabled} onChange={(e) => setQuietHours({ ...quietHours, enabled: e.target.checked })} />
              Enabled
            </label>
            <label>
              Start
              <input className="ml-2 rounded border px-2 py-1" value={String(quietHours.start_time)} onChange={(e) => setQuietHours({ ...quietHours, start_time: e.target.value })} />
            </label>
            <label>
              End
              <input className="ml-2 rounded border px-2 py-1" value={String(quietHours.end_time)} onChange={(e) => setQuietHours({ ...quietHours, end_time: e.target.value })} />
            </label>
            <button type="button" onClick={saveQuietHours} className="mt-2 w-fit rounded bg-slate-800 px-3 py-1 text-xs text-white">
              Save quiet hours
            </button>
          </div>
        )}
      </section>

      <section className="card border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-bold text-slate-950">Category Preferences</h2>
        <ul className="mt-2 space-y-2 text-xs text-slate-800">
          {preferences.map((p) => (
            <li key={String(p.id)} className="rounded bg-slate-50 px-2 py-1">
              {String(p.category)} · {String(p.channel)} · {String(p.delivery_mode)} · {p.enabled ? "enabled" : "disabled"}
            </li>
          ))}
        </ul>
      </section>

      <section className="card border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-bold text-slate-950">Consent</h2>
        <ul className="mt-2 space-y-2 text-xs text-slate-800">
          {consents.map((c) => (
            <li key={String(c.id)} className="rounded bg-slate-50 px-2 py-1">
              {String(c.channel)} · {String(c.category)} · {String(c.status)}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
