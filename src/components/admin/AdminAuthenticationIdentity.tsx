"use client";

import { useEffect, useState } from "react";
import auth from "../../../data/registry/authentication-identity.json";
import psos from "../../../data/platform-services/platform-services-operating-system.json";
import type { AuthAuditEvent, Membership, UserProfile } from "@/lib/auth/types";

export function AdminAuthenticationIdentity() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState<{ session_id: string; device_type: string | null; browser: string | null; expires_at: string }[]>([]);
  const [audit, setAudit] = useState<AuthAuditEvent[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMsg, setInviteMsg] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/identity/me").then((r) => r.json()),
      fetch("/api/auth/sessions").then((r) => r.json()),
      fetch("/api/auth/security-events").then((r) => (r.ok ? r.json() : { events: [] })),
    ]).then(([me, sess, auditData]) => {
      setProfile(me.profile ?? null);
      setSessions(sess.sessions ?? []);
      setAudit(auditData.events ?? []);
    });
  }, []);

  async function sendInvite(e: React.FormEvent) {
    e.preventDefault();
    const orgId = profile?.active_context?.organization_id ?? profile?.memberships[0]?.organization_id;
    const wsId = profile?.active_context?.workspace_id ?? profile?.memberships[0]?.workspace_id;
    if (!orgId) return;
    const res = await fetch("/api/invitations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail, organization_id: orgId, workspace_id: wsId, role_id: "member" }),
    });
    const data = await res.json();
    setInviteMsg(res.ok ? `Invitation created: ${data.accept_url}` : data.error);
  }

  return (
    <div className="space-y-6">
      <div className="card border-blue-400 bg-blue-100">
        <p className="text-xs font-semibold uppercase text-blue-900">BUILD 8.1 · Authentication and Identity Foundation</p>
        <h2 className="mt-1 text-xl font-bold text-blue-950">{auth.productName}</h2>
        <p className="mt-2 text-sm text-blue-900">{auth.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-blue-800">
          {auth.requirementId} · {auth.acceptanceCriteria} · Replaces {auth.replaces}
        </p>
        <p className="mt-2 text-xs text-blue-700">
          Docs: {auth.platformDocsPath} · <a href="/account/security" className="underline">Security Center</a>
        </p>
      </div>

      {profile && (
        <div className="card border-blue-200 bg-blue-50/50">
          <h2 className="text-lg font-bold text-blue-950">Canonical Identity</h2>
          <div className="mt-2 grid gap-2 text-xs text-blue-900 md:grid-cols-2">
            <p><strong>{profile.display_name}</strong> · {profile.primary_email}</p>
            <p>Public ID: {profile.public_id}</p>
            <p>Status: {profile.account_status} · IAL: {profile.identity_assurance_level}</p>
            <p>MFA: {profile.mfa_enabled ? "enabled" : "available"} · Onboarding: {profile.onboarding_status}</p>
          </div>
          {profile.active_context && (
            <p className="mt-2 rounded bg-white p-2 text-xs text-blue-900">
              <strong>Active context:</strong> {profile.active_context.organization_name} · {profile.active_context.workspace_name} · {profile.active_context.roles.join(", ")}
            </p>
          )}
        </div>
      )}

      <div className="card border-blue-200 bg-white">
        <h2 className="text-sm font-bold text-blue-950">Memberships</h2>
        <div className="mt-2 space-y-2">
          {(profile?.memberships ?? []).map((m: Membership) => (
            <div key={m.id} className="rounded border border-blue-100 p-2 text-xs">
              <p className="font-bold text-blue-950">{m.organization_name} · {m.workspace_name}</p>
              <p className="text-blue-800">Roles: {m.roles.join(", ")}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card border-blue-200 bg-white">
        <h2 className="text-sm font-bold text-blue-950">Invite user</h2>
        <form onSubmit={sendInvite} className="mt-2 flex flex-wrap gap-2">
          <input type="email" required placeholder="email" className="rounded border px-2 py-1 text-xs" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
          <button type="submit" className="rounded bg-blue-700 px-3 py-1 text-xs text-white">Send invitation</button>
        </form>
        {inviteMsg && <p className="mt-2 text-xs text-blue-800">{inviteMsg}</p>}
      </div>

      <div className="card border-blue-200 bg-blue-50/50">
        <h2 className="text-sm font-bold text-blue-950">Active Sessions ({sessions.length})</h2>
        <ul className="mt-2 space-y-1 text-xs text-blue-900">
          {sessions.map((s) => (
            <li key={s.session_id} className="rounded bg-white px-2 py-1">
              {s.device_type} · {s.browser ?? "unknown"} · expires {s.expires_at.slice(0, 19)}
            </li>
          ))}
        </ul>
      </div>

      <div className="card border-blue-200 bg-white">
        <h2 className="text-sm font-bold text-blue-950">Authentication audit</h2>
        <ul className="mt-2 max-h-32 space-y-1 overflow-y-auto text-xs text-blue-800">
          {audit.slice(0, 10).map((e, i) => (
            <li key={i}>{e.timestamp?.slice(0, 19)} · {e.action} · {e.result}</li>
          ))}
        </ul>
      </div>

      <div className="card border-blue-300 bg-blue-100">
        <h2 className="text-sm font-bold text-blue-950">Phase 8 Platform Services</h2>
        <p className="mt-1 text-xs text-blue-900">{psos.stepsComplete}/{psos.stepsTotal} steps · {psos.guidingPrinciple}</p>
      </div>
    </div>
  );
}
