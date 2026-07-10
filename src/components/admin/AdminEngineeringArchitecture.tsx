"use client";

import eab from "../../../data/registry/engineering-architecture-bible.json";
import doctrine from "../../../data/registry/engineering-doctrine.json";
import sysarch from "../../../data/registry/system-architecture.json";

export function AdminEngineeringArchitecture() {
  const doneSteps = eab.steps.filter((s) => s.status === "done").length;
  const nextStep = eab.steps.find((s) => s.status === "pending");

  return (
    <div className="space-y-6">
      <div className="card border-slate-400 bg-slate-100">
        <p className="text-xs font-semibold uppercase text-slate-800">VOLUME 1 · Engineering Architecture Bible</p>
        <h2 className="mt-1 text-xl font-bold text-slate-950">{eab.productName}</h2>
        <p className="mt-2 text-sm text-slate-800">What is the software architecture?</p>
        <p className="mt-2 text-xs font-semibold text-slate-700">
          {doneSteps}/{eab.stepsTotal} steps · {eab.status.replace("_", " ")}
        </p>
      </div>

      <div className="card border-blue-300 bg-blue-50">
        <p className="text-xs font-semibold uppercase text-blue-800">VOLUME-001.2 · System Architecture</p>
        <h2 className="mt-1 text-lg font-bold text-blue-950">{sysarch.title}</h2>
        <p className="mt-1 text-xs text-blue-900">{sysarch.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-blue-800">Platform Kernel · {sysarch.platformKernel.capabilities.length} capabilities</p>
        <p className="mt-1 text-xs text-blue-700">{sysarch.layers.length} layers · {sysarch.domainServices.length} domain services</p>
      </div>

      <div className="card border-green-300 bg-green-50">
        <p className="text-xs font-semibold uppercase text-green-800">VOLUME-001.1 · Engineering Doctrine</p>
        <h2 className="mt-1 text-lg font-bold text-green-950">{doctrine.title}</h2>
        <p className="mt-1 text-xs font-medium text-green-900">{doctrine.guidingPrinciple}</p>
        <p className="mt-2 text-xs italic text-green-800">{doctrine.engineeringMotto}</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Volume 1 Step Sequence</h2>
        <ul className="mt-3 space-y-1 text-sm">
          {eab.steps.map((step) => (
            <li key={step.id} className="flex items-center gap-2 text-slate-800">
              <span className={step.status === "done" ? "text-green-600" : "text-slate-300"}>
                {step.status === "done" ? "✓" : "○"}
              </span>
              <span className="font-mono text-xs text-slate-500">{step.id}</span>
              <span>{step.name}</span>
              <span className="text-xs text-slate-400">[{step.requirement}]</span>
            </li>
          ))}
        </ul>
      </div>

      {nextStep && (
        <div className="card border-amber-200 bg-amber-50/50">
          <h2 className="text-sm font-bold text-amber-950">Next Step</h2>
          <p className="mt-1 text-xs text-amber-900">
            {nextStep.id} — {nextStep.name} [{nextStep.requirement}]
          </p>
        </div>
      )}
    </div>
  );
}
