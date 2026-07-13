"use client";

import { useState } from "react";
import type { SimulationResult } from "@/lib/civic-action/builds/11.7/optimization/contracts";

export function SimulationWorkspace({ onSimulate }: { onSimulate?: (scenario: string) => SimulationResult | null }) {
  const [scenario, setScenario] = useState("communication_plan");
  const [result, setResult] = useState<SimulationResult | null>(null);

  function runSim() {
    const sim = onSimulate?.(scenario) ?? null;
    setResult(sim);
  }

  return (
    <section aria-labelledby="sim-workspace" className="card">
      <h2 id="sim-workspace" className="text-lg font-bold text-slate-900">
        Simulation Workspace
      </h2>
      <p className="mt-1 text-sm text-slate-600">Non-mutating what-if scenarios — no state changes.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <select
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
          className="rounded border border-slate-300 px-3 py-2 text-sm"
          aria-label="Scenario type"
        >
          <option value="communication_plan">Communication plan</option>
          <option value="meeting_structure">Meeting structure</option>
          <option value="reduce_threads">Reduce threads</option>
          <option value="bilingual_rollout">Bilingual rollout</option>
        </select>
        <button type="button" onClick={runSim} className="rounded bg-teal-700 px-4 py-2 text-sm text-white">
          Run simulation
        </button>
      </div>
      {result && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium">{result.note}</p>
          <ul className="mt-2 list-disc pl-4 text-sm text-slate-700">
            {result.outcomes.map((o, i) => (
              <li key={i}>{o}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
