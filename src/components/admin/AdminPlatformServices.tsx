"use client";

import psi from "../../../data/registry/platform-services-integration-bible.json";
import psa from "../../../data/registry/platform-services-architecture.json";

type ServiceReg = {
  acceptanceCriteria: string;
  status: string;
  guidingPrinciple?: string;
  corePlatformServiceCount?: number;
  servicePrincipleCount?: number;
  platformServiceMesh?: { responsibilityCount: number; abbreviation: string };
  serviceArchitecture?: { layerCount: number };
  localBrainCompatibility?: { localBrainFirstClassRuntime: boolean };
};

const FEATURED_SUBTITLES: Record<string, string> = {
  "5.1": "Platform Services",
};

const SERVICE_CARDS: { step: string; label: string; reg: ServiceReg; cardClass: string; metaClass: string; titleClass: string; featured?: boolean }[] = [
  { step: "5.1", label: "Platform Service Mesh", reg: psa, cardClass: "border-slate-300 bg-slate-50", metaClass: "text-slate-700", titleClass: "text-slate-950", featured: true },
];

export function AdminPlatformServices() {
  const pendingSteps = psi.steps.filter((s) => s.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="card border-slate-400 bg-slate-100">
        <p className="text-xs font-semibold uppercase text-slate-900">VOLUME 5 · Platform Services</p>
        <h2 className="mt-1 text-xl font-bold text-slate-950">{psi.productName}</h2>
        <p className="mt-2 text-sm text-slate-900">{psi.coreQuestion}</p>
        <p className="mt-1 text-xs italic text-slate-900">&ldquo;{psi.guidingPrinciple}&rdquo;</p>
        <p className="mt-2 text-xs font-semibold text-slate-800">
          {psi.stepsComplete}/{psi.stepsTotal} platform layers · {psi.platformServiceCount} core services · {psi.status}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {SERVICE_CARDS.map(({ step, label, reg, cardClass, metaClass, titleClass, featured }) => (
          <div key={step} className={`card ${cardClass}`}>
            <p className={`text-xs font-semibold uppercase ${metaClass}`}>
              VOLUME-00{step.replace(".", "-")} · {featured ? FEATURED_SUBTITLES[step] ?? label : label}
            </p>
            <h3 className={`mt-1 text-sm font-bold ${titleClass}`}>{label}</h3>
            {reg.guidingPrinciple ? (
              <p className={`mt-1 text-xs italic ${metaClass}`}>&ldquo;{reg.guidingPrinciple}&rdquo;</p>
            ) : null}
            <p className={`mt-2 text-xs ${metaClass}`}>
              {reg.acceptanceCriteria} · {reg.status}
            </p>
            {reg.platformServiceMesh ? (
              <p className={`mt-1 text-xs ${metaClass}`}>
                {reg.corePlatformServiceCount ?? 0} core services · {reg.servicePrincipleCount ?? 0} principles · {reg.serviceArchitecture?.layerCount ?? 0} pipeline layers · {reg.platformServiceMesh.responsibilityCount} {reg.platformServiceMesh.abbreviation} responsibilities
                {reg.localBrainCompatibility?.localBrainFirstClassRuntime ? " · LocalBrain first-class" : ""}
              </p>
            ) : null}
          </div>
        ))}

        {psi.steps
          .filter((s) => s.id !== "5.1")
          .map((s) => (
            <div key={s.id} className="card border-slate-200 bg-white opacity-75">
              <p className="text-xs font-semibold uppercase text-slate-500">VOLUME-00{s.id.replace(".", "-")}</p>
              <h3 className="mt-1 text-sm font-bold text-slate-700">{s.name}</h3>
              <p className="mt-2 text-xs text-slate-500">
                {s.requirement} · {s.status}
              </p>
            </div>
          ))}
      </div>

      {pendingSteps > 0 ? (
        <p className="text-xs text-slate-600">
          {pendingSteps} platform layer{pendingSteps === 1 ? "" : "s"} pending · LocalBrain woven throughout Volume 5
        </p>
      ) : null}
    </div>
  );
}
