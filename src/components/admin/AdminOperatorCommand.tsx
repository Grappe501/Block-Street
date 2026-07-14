"use client";

import Link from "next/link";
import certRegistry from "../../../data/v1-certification/product-certification-registry.json";
import featureDiscovery from "../../../data/registry/feature-discovery-registry.json";
import launchReadiness from "../../../data/launch-readiness.json";
import buildProgress from "../../../data/build-progress.json";
import goalForensic from "../../../data/v2/participation-goal-forensic-report.json";
import runAudit from "../../../data/v2/run-button-audit.json";
import fieldMeta from "../../../data/field-goals/ingestion-manifest.json";
import persistAudit from "../../../data/v2/production-persistence-forensic-audit.json";
import { getCountyFieldGoal, getFieldGoalsMeta, CAMPUS_GOAL_FORMULA_VERSION } from "@/lib/field-goals";

type Attention = { id: string; severity: "high" | "medium" | "low"; title: string; next: string };

const HIERARCHY = ["Vision", "Product Truth", "Journey Certification", "Implementation", "Deployment"] as const;

const SEVERITY: Record<string, string> = {
  high: "border-red-300 bg-red-50 text-red-950",
  medium: "border-amber-300 bg-amber-50 text-amber-950",
  low: "border-slate-200 bg-slate-50 text-slate-900",
};

function buildAttention(): Attention[] {
  const attention: Attention[] = [];
  const launch = certRegistry.launchDoctrine;
  if (launch?.inviteChainCertification === "pending") {
    attention.push({
      id: "attn-invite-cert",
      severity: "high",
      title: "Invite chain not CERTIFIED PRESENT",
      next: "Run V1-JRN-INVITE-CHAIN-01 on production — docs/v1-certification/V1_INVITE_CHAIN_CERTIFICATION_GATE.md",
    });
  }
  if (launch?.largeScaleLaunch === "not_approved") {
    attention.push({
      id: "attn-large-scale",
      severity: "medium",
      title: "Large-scale launch not approved",
      next: "Stay invite-only soft beta until invite-chain CERTIFIED PRESENT",
    });
  }
  if (buildProgress.project?.databaseStatus === "not_connected") {
    attention.push({
      id: "attn-db",
      severity: "medium",
      title: "Postgres not connected",
      next: "V2-B Blobs→Postgres only after invite cert + Operator Command slice are solid",
    });
  }
  const pendingFeatures = (featureDiscovery.features ?? []).filter((f) => f.certification === "pending_cert");
  if (pendingFeatures.length) {
    attention.push({
      id: "attn-feat-pending",
      severity: "low",
      title: `${pendingFeatures.length} features pending journey certification`,
      next: "Certification state here must not exceed the journey ledger",
    });
  }
  return attention;
}

export function AdminOperatorCommand() {
  const journeys = certRegistry.journeys ?? [];
  const pendingCert = journeys.filter((j) => j.status === "pending" || j.status === "not_started");
  const features = featureDiscovery.features ?? [];
  const byAudience: Record<string, number> = {};
  for (const f of features) {
    byAudience[f.audience] = (byAudience[f.audience] ?? 0) + 1;
  }
  const attention = buildAttention();
  const launch = certRegistry.launchDoctrine ?? {};
  const tip =
    "productionCommit" in (buildProgress.project ?? {})
      ? String((buildProgress.project as { productionCommit?: string }).productionCommit ?? "")
      : "";
  const clark = getCountyFieldGoal("clark");

  return (
    <div className="space-y-6">
      <div className="card border-brand-300 bg-brand-50">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-800">V2-A · Audience: Operator</p>
        <h2 className="mt-1 text-xl font-bold text-slate-950">Operator Command</h2>
        <p className="mt-2 text-sm text-slate-800">
          What exists · what is incomplete · what needs attention · what happens next. Build % is not product
          truth.
        </p>
        <p className="mt-2 text-xs text-slate-600">
          {(buildProgress.project as { activeProgram?: string })?.activeProgram ?? "V2"} · tip {tip || "—"}
        </p>
      </div>

      <div className="card border-slate-200 bg-white p-4">
        <h3 className="text-sm font-bold text-slate-950">Certification hierarchy</h3>
        <p className="mt-2 font-mono text-xs text-slate-700">{HIERARCHY.join(" → ")}</p>
        <p className="mt-2 text-xs text-slate-600">
          Not the reverse. A deployment can succeed while certification remains incomplete.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card border-slate-200 bg-white p-3 text-center">
          <p className="text-2xl font-bold text-brand-700">
            {launchReadiness.summary?.launchReady ? "Ready" : "No"}
          </p>
          <p className="text-xs text-slate-600">PHASE-001.7 narrow</p>
        </div>
        <div className="card border-slate-200 bg-white p-3 text-center">
          <p className="text-2xl font-bold text-amber-700">{String(launch.inviteChainCertification ?? "—")}</p>
          <p className="text-xs text-slate-600">Invite chain cert</p>
        </div>
        <div className="card border-slate-200 bg-white p-3 text-center">
          <p className="text-2xl font-bold text-slate-900">{pendingCert.length}</p>
          <p className="text-xs text-slate-600">Journeys not certified</p>
        </div>
        <div className="card border-slate-200 bg-white p-3 text-center">
          <p className="text-2xl font-bold text-slate-900">{features.length}</p>
          <p className="text-xs text-slate-600">Features registered</p>
        </div>
      </div>

      <div className="card border-slate-200 bg-white p-4">
        <h3 className="text-sm font-bold text-slate-950">V2-A.3 — Volunteer Command · Leadership hierarchy</h3>
        <ul className="mt-3 space-y-1.5 text-xs text-slate-800">
          <li>
            Volunteer Command:{" "}
            <Link className="text-brand-800 underline" href="/admin/volunteer-command">
              /admin/volunteer-command
            </Link>{" "}
            (aliases /admin/volunteers · /admin/volunteer-manager)
          </li>
          <li>
            Hierarchy: Director → Volunteer Manager → County / Education / Functional commands
          </li>
          <li>
            College Command subordinate:{" "}
            <Link className="text-brand-800 underline" href="/admin/college-command">
              /admin/college-command
            </Link>
          </li>
          <li>
            Campus formula (canonical): <code>{CAMPUS_GOAL_FORMULA_VERSION}</code> (
            {getFieldGoalsMeta().campus_goal_formula}) — enrollment ÷ estimated county VAP · flat 25%{" "}
            <strong>superseded</strong>
          </li>
          <li>
            Field Plan: 30K-ft Victory Field Framework <strong>ingested</strong> — role content live via role keys;
            county/city drill-down pending
          </li>
          <li>
            Field Strategy Manual (static presentation):{" "}
            <Link className="text-brand-800 underline" href="/field-strategy">
              /field-strategy
            </Link>{" "}
            · Benton:{" "}
            <Link className="text-brand-800 underline" href="/field-strategy/benton">
              /field-strategy/benton
            </Link>
          </li>
          <li>
            Persistence: <strong>{String(persistAudit.canonical_persistence_backend)}</strong> · Postgres active?{" "}
            <strong>{String(persistAudit.netlify_database_postgres_active)}</strong> · personnel writes mostly
            scaffold
          </li>
          <li>Invite-chain certification: PENDING · build shell ≠ journey cert</li>
        </ul>
      </div>

      <div className="card border-slate-200 bg-white p-4">
        <h3 className="text-sm font-bold text-slate-950">V2-A.2 — RedDirt · College Command · Persistence</h3>
        <ul className="mt-3 space-y-1.5 text-xs text-slate-800">
          <li>
            RedDirt ingestion: <strong>{fieldMeta.county_count ?? 0} / 75</strong> counties ·{" "}
            {(fieldMeta.missing as unknown[] | undefined)?.length ? "gaps present" : "complete snapshot"}
          </li>
          <li>
            Clark sample: registration {clark?.voter_registration_goal ?? "—"} · VCI {clark?.vci ?? "—"}
          </li>
          <li>
            Institution rule (legacy snapshot field): flat 25% stored historically —{" "}
            <strong>not active</strong> for campus UI
          </li>
          <li>
            Director Omniview: <a className="text-brand-800 underline" href="/admin/director">/admin/director</a> ·
            read-only inspect banners
          </li>
          <li>V2-B: deferred — readiness map prepared, no blind cutover</li>
          <li>Product Run buttons: {(runAudit.participant_run_buttons ?? []).length} · Cursor IDE Run ≠ product</li>
        </ul>
      </div>

      <div className="card border-slate-200 bg-white p-4">
        <h3 className="text-sm font-bold text-slate-950">V2-A participation slice (honest status)</h3>
        <ul className="mt-3 space-y-1.5 text-xs text-slate-800">
          <li>
            Position membership model: <strong>shipped</strong> (multi co-lead + volunteer · no single leader_id)
          </li>
          <li>
            Position cards — county &amp; college: <strong>shipped</strong> via CommunityWorkspace PositionCards
          </li>
          <li>
            Goal forensic (Henderson): displayed 6 was <strong>fake current</strong> (
            {goalForensic.formula}) — not aliases
          </li>
          <li>
            Honest metrics on school/county goals UI: Goal{" "}
            {goalForensic.honestPostFix?.participation_goal} · Current confirmed{" "}
            {goalForensic.honestPostFix?.confirmed_participants} · Still needed{" "}
            {goalForensic.honestPostFix?.remaining_need} · system identities{" "}
            {goalForensic.honestPostFix?.system_identities} (aliases collapsed)
          </li>
          <li>
            Alias dedupe: <strong>canonical_person_id</strong> COUNT DISTINCT
          </li>
          <li>
            Product participant “Run” buttons: <strong>{(runAudit.participant_run_buttons ?? []).length}</strong>{" "}
            found · Cursor IDE Run is not product UI
          </li>
          <li>
            Hosted execution: Git→Netlify live · browser-as-worker forbidden · V2-B Postgres still deferred
          </li>
          <li>
            Certification impact: invite-chain still <strong>PENDING</strong> — this slice does not grant large-scale
            launch
          </li>
          <li>
            Remaining blockers: invite-chain evidence · Field Plan upload for position details · Steve Cursor Run
            Everything setting
          </li>
        </ul>
        <p className="mt-2 text-[11px] text-slate-500">
          Docs: V2A_PARTICIPATION_GOAL_FORENSIC_REPORT · V2A_RUN_BUTTON_AUDIT — artifact complete ≠ launch claim
        </p>
      </div>

      <div className="card border-slate-200 bg-white p-4">
        <h3 className="text-sm font-bold text-slate-950">Needs attention</h3>
        <ul className="mt-3 space-y-2">
          {attention.map((a) => (
            <li key={a.id} className={`rounded-lg border p-3 text-sm ${SEVERITY[a.severity]}`}>
              <p className="font-semibold">{a.title}</p>
              <p className="mt-1 text-xs opacity-90">{a.next}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="card border-slate-200 bg-white p-4">
        <h3 className="text-sm font-bold text-slate-950">Journey certification ledger</h3>
        <ul className="mt-3 space-y-1 text-xs">
          {journeys.map((j) => (
            <li
              key={j.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded border border-slate-100 px-2 py-1.5"
            >
              <span>
                <code className="text-brand-700">{j.id}</code> · {j.name}
                {"lane" in j && j.lane ? ` · ${j.lane}` : ""}
              </span>
              <span className="font-semibold uppercase text-slate-700">{j.status.replace(/_/g, " ")}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card border-slate-200 bg-white p-4">
          <h3 className="text-sm font-bold text-slate-950">Features by audience</h3>
          <ul className="mt-2 space-y-1 text-xs text-slate-800">
            {Object.entries(byAudience).map(([k, v]) => (
              <li key={k} className="flex justify-between border-b border-slate-50 py-1">
                <span>{k}</span>
                <span className="font-semibold">{v}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card border-slate-200 bg-white p-4">
          <h3 className="text-sm font-bold text-slate-950">What should happen next</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs text-slate-800">
            <li>Collect evidence for V1-JRN-INVITE-CHAIN-01 on production</li>
            <li>Upload Field Plan to replace position-content placeholders</li>
            <li>Defer V2-B Postgres until invite cert is solid</li>
          </ol>
          <p className="mt-3 text-xs text-slate-600">V2 order: V2-A → V2-B → V2-C → V2-D → V2-E → V2-F</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/schools/henderson-state" className="font-medium text-brand-700 underline">
          /schools/henderson-state
        </Link>
        <Link href="/start" className="font-medium text-brand-700 underline">
          /start (invite)
        </Link>
        <Link href="/july-14" className="font-medium text-brand-700 underline">
          /july-14 agenda
        </Link>
        <a
          href={String((buildProgress.project as { deployUrl?: string })?.deployUrl ?? "https://block-street.netlify.app/")}
          className="font-medium text-brand-700 underline"
          target="_blank"
          rel="noreferrer"
        >
          Production
        </a>
      </div>
    </div>
  );
}
