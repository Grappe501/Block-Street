"use client";

import Link from "next/link";
import certRegistry from "../../../data/v1-certification/product-certification-registry.json";
import featureDiscovery from "../../../data/registry/feature-discovery-registry.json";
import launchReadiness from "../../../data/launch-readiness.json";
import buildProgress from "../../../data/build-progress.json";

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
            <li>Keep Operator Command as the default operator view</li>
            <li>Defer V2-B Postgres until invite cert + this Command slice are solid</li>
          </ol>
          <p className="mt-3 text-xs text-slate-600">V2 order: V2-A → V2-B → V2-C → V2-D → V2-E → V2-F</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-sm">
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
