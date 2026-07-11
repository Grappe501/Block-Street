"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { AuthAuditEvent, Membership, UserProfile } from "@/lib/auth/types";

export function AccountSecurityCenter() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState<{ session_id: string; browser: string | null; device_type: string | null; expires_at: string }[]>([]);
  const [events, setEvents] = useState<AuthAuditEvent[]>([]);
  const [providers, setProviders] = useState<Record<string, boolean>>({});

  useEffect(() => {
    Promise.all([
      fetch("/api/identity/me").then((r) => r.json()),
      fetch("/api/auth/sessions").then((r) => r.json()),
      fetch("/api/auth/security-events").then((r) => r.json()),
      fetch("/api/auth/providers").then((r) => r.json()),
    ]).then(([me, sess, sec, prov]) => {
      setProfile(me.profile ?? null);
      setSessions(sess.sessions ?? []);
      setEvents(sec.events ?? []);
      setProviders(prov.providers ?? {});
    });
  }, []);

  async function revokeSession(id: string) {
    await fetch(`/api/auth/sessions/${id}`, { method: "DELETE" });
    setSessions((s) => s.filter((x) => x.session_id !== id));
  }

  async function logoutAll() {
    await fetch("/api/auth/logout-all", { method: "POST" });
    window.location.href = "/login";
  }

  async function switchContext(m: Membership) {
    await fetch("/api/identity/context", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organization_id: m.organization_id, workspace_id: m.workspace_id }),
    });
    const me = await fetch("/api/identity/me").then((r) => r.json());
    setProfile(me.profile ?? null);
  }

  return (
    <div className="min-h-screen bg-blue-50 px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <Link href="/" className="text-sm text-blue-700 underline">Block Street</Link>
          <h1 className="mt-2 text-2xl font-bold text-blue-950">Security Center</h1>
          <p className="text-sm text-blue-800">Manage your identity, sessions, and active workspace context</p>
        </div>

        {profile && (
          <section className="card border-blue-200 bg-white p-4">
            <h2 className="font-bold text-blue-950">Identity</h2>
            <p className="mt-1 text-sm text-blue-900">{profile.display_name} · {profile.primary_email}</p>
            <p className="text-xs text-blue-700">Status: {profile.account_status} · IAL: {profile.identity_assurance_level} · MFA: {profile.mfa_enabled ? "on" : "off"}</p>
            {profile.active_context && (
              <p className="mt-2 rounded bg-blue-50 p-2 text-xs text-blue-900">
                <strong>Active context:</strong> {profile.active_context.organization_name} · {profile.active_context.workspace_name} · {profile.active_context.roles.join(", ")}
              </p>
            )}
          </section>
        )}

        <section className="card border-blue-200 bg-white p-4">
          <h2 className="font-bold text-blue-950">Workspace context</h2>
          <div className="mt-2 space-y-2">
            {(profile?.memberships ?? []).map((m) => (
              <button key={m.id} type="button" onClick={() => switchContext(m)} className="block w-full rounded border border-blue-100 p-2 text-left text-xs hover:bg-blue-50">
                <span className="font-bold text-blue-950">{m.organization_name}</span> · {m.workspace_name}
                <span className="block text-blue-600">{m.roles.join(", ")}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="card border-blue-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-blue-950">Active sessions</h2>
            <button type="button" onClick={logoutAll} className="text-xs text-red-700 underline">Sign out everywhere</button>
          </div>
          <ul className="mt-2 space-y-1 text-xs">
            {sessions.map((s) => (
              <li key={s.session_id} className="flex items-center justify-between rounded bg-blue-50 px-2 py-1">
                <span>{s.device_type} · {s.browser ?? "unknown"} · expires {s.expires_at.slice(0, 16)}</span>
                <button type="button" onClick={() => revokeSession(s.session_id)} className="text-red-700 underline">Revoke</button>
              </li>
            ))}
          </ul>
        </section>

        <section className="card border-blue-200 bg-white p-4">
          <h2 className="font-bold text-blue-950">Sign-in methods</h2>
          <ul className="mt-2 text-xs text-blue-800">
            {Object.entries(providers).map(([k, v]) => (
              <li key={k}>{k}: {v ? "enabled" : "disabled"}</li>
            ))}
          </ul>
          <div className="mt-3 flex gap-2 text-xs">
            <Link href="/mfa/setup" className="text-blue-700 underline">MFA setup</Link>
            <Link href="/account/sessions" className="text-blue-700 underline">All sessions</Link>
          </div>
        </section>

        <section className="card border-blue-200 bg-white p-4">
          <h2 className="font-bold text-blue-950">Recent security activity</h2>
          <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto text-xs text-blue-800">
            {events.slice(0, 15).map((e, i) => (
              <li key={i}>{e.timestamp?.slice(0, 19)} · {e.action} · {e.result}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
