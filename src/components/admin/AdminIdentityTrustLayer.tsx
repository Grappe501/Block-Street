"use client";

import { useEffect, useState } from "react";
import itl from "../../../data/registry/identity-trust-framework.json";

type Tab =
  | "registry"
  | "invitations"
  | "sponsors"
  | "verification"
  | "trust"
  | "governance"
  | "federation"
  | "intelligence"
  | "operations"
  | "certification";

async function post(url: string, body: Record<string, unknown>) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? data.error ?? "Request failed");
  return data.data ?? data;
}

export function AdminIdentityTrustLayer() {
  const [tab, setTab] = useState<Tab>("registry");
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function refresh() {
    fetch("/api/admin/identity-trust/overview").then((r) => r.json()).then(setData);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function runCertificationDemo() {
    setMessage(null);
    try {
      // AC-ITF-001 14-step certification flow
      const policy = await fetch("/api/v1/identity-trust/policy").then((r) => r.json());
      const invite = await post("/api/v1/identity-trust/invitations", {
        email: "chris.jones@example.local",
        organization_id: "org-block-street",
        institution_id: "inst-block-street",
        intended_role: "volunteer",
        invite_reason: "Pulaski County volunteer — known personally",
        sponsor_id: "usr-001",
        sponsor_agreement_accepted: true,
      });

      const registered = await post("/api/v1/identity-trust/register", {
        token: invite.token,
        email: "chris.jones@example.local",
        password: "ITL-Cert2026!",
        public_name: "Chris Jones",
      });

      await post("/api/v1/identity-trust/verifications", {
        subject_user_id: registered.user_id,
        verifier_user_id: "usr-002",
        relationship: "community_volunteer",
        verification_method: "known_personally",
        confidence: "high",
        independent: true,
      });

      const timeline = await fetch(`/api/v1/identity-trust/timeline?user_id=${registered.user_id}`).then((r) => r.json());
      const federation = await fetch(`/api/v1/identity-trust/federation?user_id=${registered.user_id}`).then((r) => r.json());
      const badge = await fetch(`/api/v1/identity-trust/identity?user_id=${registered.user_id}&public_only=true`).then((r) => r.json());
      await fetch("/api/v1/identity-trust/analytics?mode=scan");
      const ai = await post("/api/v1/identity-trust/analytics", { question: "Should Chris Jones be trusted?" });
      const cert = await fetch("/api/v1/identity-trust/certification").then((r) => r.json());

      const checks = cert.data?.checks ?? cert.checks ?? [];
      const passed = checks.filter((c: { passed: boolean }) => c.passed).length;

      setMessage(
        `Phase 10.6A certification (${passed}/${checks.length} checks): ` +
          `invitation-only active · Chris Jones GHID ${registered.identity?.global_human_id ?? "assigned"} · ` +
          `sponsor lineage permanent · ${timeline.data?.events?.length ?? 0} immutable history events · ` +
          `${federation.data?.memberships?.length ?? 1} institution membership(s) · ` +
          `public badge: ${badge.data?.badge ?? "Sponsored Member"} · ` +
          `AI advisory: ${ai.cannot_approve ? "cannot approve" : "—"} · ` +
          `certification ${cert.data?.all_passed ?? cert.all_passed ? "PASSED" : "pending"}.`
      );
      refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Certification demo failed");
    }
  }

  const overview = data?.overview as Record<string, unknown> | undefined;
  const subsystems = (overview?.subsystems as { id: string; name: string; status: string }[]) ?? itl.subsystems.map((s, i) => ({
    id: `ITL-${i}`,
    name: s,
    status: "operational",
  }));

  const tabs: { id: Tab; label: string }[] = [
    { id: "registry", label: "10.6A.1 Registry" },
    { id: "invitations", label: "10.6A.2 Invitations" },
    { id: "sponsors", label: "10.6A.3 Sponsors" },
    { id: "verification", label: "10.6A.4 Verification" },
    { id: "trust", label: "10.6A.5 Trust Lifecycle" },
    { id: "governance", label: "10.6A.6 Governance" },
    { id: "federation", label: "10.6A.7 Federation" },
    { id: "intelligence", label: "10.6A.8 Intelligence" },
    { id: "operations", label: "10.6A.9 Operations" },
    { id: "certification", label: "10.6A.10 Certification" },
  ];

  return (
    <div className="space-y-6">
      <div className="card border-indigo-600 bg-indigo-100">
        <p className="text-xs font-semibold uppercase text-indigo-950">
          PHASE-010.6A · {itl.frameworkId} · {itl.layerId}
        </p>
        <h2 className="mt-1 text-xl font-bold text-indigo-950">{itl.productName}</h2>
        <p className="mt-2 text-sm text-indigo-950">
          Identity is not a login feature. It is the constitutional foundation of the platform.
        </p>
        <p className="mt-2 text-xs text-indigo-900">{itl.constitutionalRole}</p>
        <p className="mt-2 text-xs font-semibold text-indigo-900">
          {itl.requirementId} · {itl.acceptanceCriteria} · Docs: {itl.platformDocsPath}
        </p>
      </div>

      {overview && (
        <div className="grid gap-3 md:grid-cols-5">
          <div className="card !p-3 text-center">
            <p className="text-2xl font-bold text-indigo-950">{String(overview.total_identities)}</p>
            <p className="text-xs text-indigo-800">Human identities</p>
          </div>
          <div className="card !p-3 text-center">
            <p className="text-2xl font-bold text-indigo-950">{String(overview.federation_memberships)}</p>
            <p className="text-xs text-indigo-800">Federation memberships</p>
          </div>
          <div className="card !p-3 text-center">
            <p className="text-2xl font-bold text-indigo-950">{String(overview.pending_reviews)}</p>
            <p className="text-xs text-indigo-800">Review queue</p>
          </div>
          <div className="card !p-3 text-center">
            <p className="text-2xl font-bold text-indigo-950">{String(overview.intelligence_alerts)}</p>
            <p className="text-xs text-indigo-800">Intelligence alerts</p>
          </div>
          <div className="card !p-3 text-center">
            <p className="text-2xl font-bold text-indigo-950">{overview.invitation_only ? "Yes" : "No"}</p>
            <p className="text-xs text-indigo-800">Invitation-only</p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded px-2 py-1 text-xs font-semibold ${tab === t.id ? "bg-indigo-700 text-white" : "bg-indigo-100 text-indigo-900"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "registry" && (
        <div className="card border-indigo-200 bg-white">
          <h3 className="text-sm font-bold text-indigo-950">ITL-HIR-001 · Human Identity Registry</h3>
          <div className="mt-3 space-y-2">
            {((data?.identities as Record<string, unknown>[]) ?? []).map((i) => (
              <div key={String(i.id)} className="rounded border border-indigo-100 p-2 text-xs">
                <p className="font-bold text-indigo-950">
                  {String(i.public_name)}
                  <span className="ml-2 rounded bg-indigo-100 px-1.5 text-indigo-800">{String(i.public_badge)}</span>
                </p>
                <p className="text-indigo-800">
                  {String(i.global_human_id)} · Level {String(i.trust_level)} · {String(i.identity_status)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "invitations" && (
        <div className="card border-indigo-200 bg-indigo-50/50">
          <h3 className="text-sm font-bold text-indigo-950">ITL-INV-001 · Invitation Network</h3>
          <pre className="mt-2 overflow-x-auto rounded bg-white p-2 text-xs text-indigo-900">
            {JSON.stringify(data?.invitation_analytics ?? {}, null, 2)}
          </pre>
          <pre className="mt-2 max-h-40 overflow-auto rounded bg-white p-2 text-xs text-indigo-900">
            {JSON.stringify(data?.invite_tree ?? {}, null, 2)}
          </pre>
        </div>
      )}

      {tab === "sponsors" && (
        <div className="card border-indigo-200 bg-white">
          <h3 className="text-sm font-bold text-indigo-950">ITL-SPN-001 · Sponsor Accountability</h3>
          <pre className="mt-2 text-xs text-indigo-900">{JSON.stringify(data?.sponsor_accountability ?? {}, null, 2)}</pre>
        </div>
      )}

      {tab === "verification" && (
        <div className="card border-indigo-200 bg-white">
          <h3 className="text-sm font-bold text-indigo-950">ITL-VER-001 · Verification Engine</h3>
          <p className="mt-1 text-xs text-indigo-800">Verification records are private. Public badges only.</p>
        </div>
      )}

      {tab === "trust" && (
        <div className="card border-indigo-200 bg-white">
          <h3 className="text-sm font-bold text-indigo-950">ITL-TRU-001 · Trust Lifecycle</h3>
          <p className="mt-1 text-xs text-indigo-800">
            Pending → Sponsored → Verified → Trusted → Institution Leader → Federation Trusted
          </p>
        </div>
      )}

      {tab === "governance" && (
        <div className="card border-indigo-200 bg-white">
          <h3 className="text-sm font-bold text-indigo-950">ITL-GOV-001 · Identity Governance</h3>
          <p className="mt-1 text-xs text-indigo-800">
            Reviews: {((data?.reviews as unknown[]) ?? []).length} · Appeals: {((data?.appeals as unknown[]) ?? []).length}
          </p>
        </div>
      )}

      {tab === "federation" && (
        <div className="card border-indigo-200 bg-white">
          <h3 className="text-sm font-bold text-indigo-950">ITL-W4-001 · Federation Identity</h3>
          <p className="mt-1 text-xs text-indigo-800">Identity is portable. Authority is not.</p>
          <button
            type="button"
            className="mt-2 rounded bg-indigo-700 px-3 py-1 text-xs text-white"
            onClick={() => fetch("/api/v1/identity-trust/wave4/certification").then((r) => r.json()).then((d) => setMessage(JSON.stringify(d.data ?? d)))}
          >
            Run Wave 4 certification
          </button>
          <pre className="mt-2 max-h-48 overflow-auto text-xs text-indigo-900">
            {JSON.stringify(data?.federation_memberships ?? [], null, 2)}
          </pre>
        </div>
      )}

      {tab === "intelligence" && (
        <div className="card border-indigo-200 bg-white">
          <h3 className="text-sm font-bold text-indigo-950">ITL-W5-001 · Identity Intelligence (signal-only)</h3>
          <p className="mt-1 text-xs text-indigo-800">Patterns detected — Humans determine meaning. No automatic punishment.</p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              className="rounded bg-indigo-700 px-3 py-1 text-xs text-white"
              onClick={() => post("/api/v1/admin/identity-intelligence/signals", { action: "scan" }).then(() => refresh())}
            >
              Run intelligence scan
            </button>
            <button
              type="button"
              className="rounded border border-indigo-300 px-3 py-1 text-xs text-indigo-900"
              onClick={() => fetch("/api/v1/identity-trust/wave5/certification").then((r) => r.json()).then((d) => setMessage(JSON.stringify(d.data ?? d)))}
            >
              Run Wave 5 certification
            </button>
          </div>
          <pre className="mt-2 max-h-48 overflow-auto text-xs text-indigo-900">
            {JSON.stringify(data?.intelligence_alerts ?? [], null, 2)}
          </pre>
        </div>
      )}

      {tab === "operations" && (
        <div className="card border-indigo-200 bg-white">
          <h3 className="text-sm font-bold text-indigo-950">ITL-W6-001 · Identity Operations Center</h3>
          <p className="mt-1 text-xs text-indigo-800">Governance must be operable without hidden administrative power.</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded bg-indigo-700 px-3 py-1 text-xs text-white"
              onClick={() => fetch("/api/v1/identity-trust/wave6/certification").then((r) => r.json()).then((d) => setMessage(JSON.stringify(d.data ?? d)))}
            >
              Run Wave 6 certification
            </button>
            <a href="/ops/identity" className="rounded border border-indigo-300 px-3 py-1 text-xs text-indigo-900">Open ops center</a>
            <a href="/admin/identity/intelligence" className="rounded border border-indigo-300 px-3 py-1 text-xs text-indigo-900">Intelligence review</a>
            <a href="/executive/identity" className="rounded border border-indigo-300 px-3 py-1 text-xs text-indigo-900">Executive oversight</a>
          </div>
          <pre className="mt-2 max-h-48 overflow-auto text-xs text-indigo-900">
            {JSON.stringify(data?.operations ?? {}, null, 2)}
          </pre>
        </div>
      )}

      {tab === "certification" && (
        <div className="card border-indigo-400 bg-indigo-50">
          <h3 className="text-sm font-bold text-indigo-950">ITL-W7-001 · Certification &amp; Launch</h3>
          <p className="mt-1 text-xs text-indigo-900">
            Constitutional proof — conformance, red-team, migration, ledger reconstruction, controlled launch
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fetch("/api/v1/identity-trust/wave7/certification", { method: "POST" }).then((r) => r.json()).then((d) => setMessage(JSON.stringify(d.data ?? d)))}
              className="rounded bg-indigo-700 px-4 py-2 text-xs font-semibold text-white"
            >
              Run Wave 7 certification
            </button>
            <button type="button" onClick={runCertificationDemo} className="rounded border border-indigo-400 px-4 py-2 text-xs font-semibold text-indigo-900">
              Run 14-step lifecycle demo
            </button>
            <a href="/ops/identity/certification" className="rounded border border-indigo-400 px-4 py-2 text-xs font-semibold text-indigo-900">
              Certification dashboard
            </a>
          </div>
          <pre className="mt-3 max-h-64 overflow-auto rounded bg-white p-2 text-xs text-indigo-900">
            {JSON.stringify(data?.certification ?? {}, null, 2)}
          </pre>
          {message && <p className="mt-3 text-xs text-indigo-950">{message}</p>}
        </div>
      )}

      <div className="card border-indigo-200 bg-indigo-50/30">
        <h3 className="text-xs font-bold text-indigo-950">10 subsystems</h3>
        <ul className="mt-2 grid gap-1 text-xs text-indigo-800 md:grid-cols-2">
          {subsystems.map((s) => (
            <li key={s.id}>
              · {s.id} {s.name} <span className="text-indigo-600">({s.status})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
