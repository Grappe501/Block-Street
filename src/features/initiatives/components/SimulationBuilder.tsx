"use client";

import { useState } from "react";

const SCENARIOS = [
  { id: "volunteer_loss", label: "Lose volunteers", defaultPct: 40 },
  { id: "funding_decrease", label: "Funding decreases", defaultPct: 20 },
  { id: "timeline_slip", label: "Timeline slips", defaultWeeks: 4 },
  { id: "initiative_double", label: "Initiative portfolio doubles", defaultPct: 0 },
  { id: "statewide_launch", label: "Statewide launch", defaultPct: 0 },
];

export function SimulationBuilder({
  onResult,
}: {
  onResult: (result: { outcomes: string[]; risks: string[]; note: string }) => void;
}) {
  const [scenario, setScenario] = useState(SCENARIOS[0].id);
  const [pct, setPct] = useState(40);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    const params =
      scenario === "timeline_slip"
        ? { weeks: pct }
        : scenario === "initiative_double" || scenario === "statewide_launch"
          ? {}
          : { percent: pct };
    const res = await fetch("/api/v1/simulation/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenario_type: scenario, parameters: params }),
    });
    const data = await res.json();
    const sim = data.data?.simulation;
    if (sim) onResult(sim);
    setLoading(false);
  }

  const showPct = !["initiative_double", "statewide_launch"].includes(scenario);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">Simulation builder</h2>
      <p className="text-xs text-slate-500">What-if scenarios — nothing changes in reality</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <select
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
          className="rounded border border-slate-300 px-3 py-2 text-sm"
        >
          {SCENARIOS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        {showPct && (
          <label className="flex items-center gap-2 text-sm">
            {scenario === "timeline_slip" ? "Weeks" : "Percent"}
            <input
              type="number"
              min={1}
              max={100}
              value={pct}
              onChange={(e) => setPct(Number(e.target.value))}
              className="w-20 rounded border border-slate-300 px-2 py-1"
            />
          </label>
        )}
        <button
          type="button"
          onClick={run}
          disabled={loading}
          className="rounded bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
        >
          {loading ? "Running…" : "Run simulation"}
        </button>
      </div>
    </section>
  );
}
