"use client";

import { useEffect, useState } from "react";
import auth from "../../../data/registry/authentication-identity.json";
import psos from "../../../data/platform-services/platform-services-operating-system.json";
import type { AuthAuditEvent, Membership, UserProfile } from "@/lib/auth/types";

export function AdminAuthenticationIdentity() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState<{ session_id: string; created_at: string; expires_at: string }[]>([]);
  const [audit, setAudit] = useState<AuthAuditEvent[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      fetch("/api/auth/sessions").then((r) => r.json()),
      fetch("/api/auth/audit").then((r) => (r.ok ? r.json() : { events: [] })),
    ]).then(([me, sess, auditData]) => {
      setProfile(me.profile ?? null);
      setSessions(sess.sessions ?? []);
      setAudit(auditData.events ?? []);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="card border-blue-400 bg-blue-100">
        <p className="text-xs font-semibold uppercase text-blue-900">BUILD 8.1 · Authentication and Identity</p>
        <h2 className="mt-1 text-xl font-bold text-blue-950">{auth.productName}</h2>
        <p className="mt-2 text-sm text-blue-900">{auth.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-blue-800">
          {auth.requirementId} · {auth.acceptanceCriteria} · Replaces {auth.replaces}
        </p>
      </div>

      {profile && (
        <div className="card border-blue-200 bg-blue-50/50">
          <h2 className="text-lg font-bold text-blue-950">Canonical Identity</h2>
          <div className="mt-2 grid gap-2 text-xs text-blue-900 md:grid-cols-2">
            <p><strong>{profile.display_name}</strong> · {profile.primary_email}</p>
            <p>Status: {profile.account_status} · IAL: {profile.identity_assurance_level}</p>
            <p>MFA: {profile.mfa_enabled ? "enabled" : "available"} · Security: {profile.security_state}</p>
            <p>Methods: {profile.authentication_methods.join(", ")}</p>
          </div>
        </div>
      )}

      <div className="card border-blue-200 bg-white">
        <h2 className="text-sm font-bold text-blue-950">Membership Model</h2>
        <div className="mt-2 space-y-2">
          {(profile?.memberships ?? []).map((m: Membership) => (
            <div key={m.id} className="rounded border border-blue-100 p-2 text-xs">
              <p className="font-bold text-blue-950">{m.organization_name} · {m.workspace_name}</p>
              <p className="text-blue-800">Roles: {m.roles.join(", ")}</p>
              <p className="text-blue-600">Permissions: {m.permissions.join(", ")}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card border-blue-200 bg-blue-50/50">
        <h2 className="text-sm font-bold text-blue-950">Active Sessions ({sessions.length})</h2>
        <ul className="mt-2 space-y-1 text-xs text-blue-900">
          {sessions.map((s) => (
            <li key={s.session_id} className="rounded bg-white px-2 py-1 font-mono">
              {s.session_id.slice(0, 20)}… · expires {s.expires_at.slice(0, 19)}
            </li>
          ))}
        </ul>
      </div>

      <div className="card border-blue-200 bg-white">
        <h2 className="text-sm font-bold text-blue-950">Protected Routes</h2>
        <p className="mt-1 text-xs text-blue-800">{auth.protectedRoutes.join(" · ")}</p>
        <p className="mt-2 text-xs text-blue-600">Middleware enforces session cookie · Honor system removed</p>
      </div>

      <div className="card border-blue-300 bg-blue-100">
        <h2 className="text-sm font-bold text-blue-950">Phase 8 Platform Services</h2>
        <p className="mt-1 text-xs text-blue-900">{psos.stepsComplete}/{psos.stepsTotal} steps · {psos.guidingPrinciple}</p>
      </div>
    </div>
  );
}
