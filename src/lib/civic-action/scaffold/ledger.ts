import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data", "civic-action");

export interface BuildProgress {
  name: string;
  system_id: string;
  percent: number;
  current_wave: string | null;
  waves_completed: string[];
}

export interface ScaffoldState {
  scaffold_id: string;
  phase_id: string;
  total_builds: number;
  waves_per_build: number;
  total_planned_waves: number;
  phase_overall_percent: number;
  current_wave: string;
  recommended_next_wave: string;
  builds: Record<string, BuildProgress>;
  wave_history: { wave_id: string; build: string; name: string; completed_at: string; status: string }[];
}

export function loadScaffold(): ScaffoldState {
  return JSON.parse(readFileSync(join(DATA_DIR, "scaffold.json"), "utf8")) as ScaffoldState;
}

export function persistScaffold(state: ScaffoldState) {
  writeFileSync(join(DATA_DIR, "scaffold.json"), JSON.stringify(state, null, 2));
}

export function loadRequirementsRegistry() {
  return JSON.parse(readFileSync(join(DATA_DIR, "requirements_registry.json"), "utf8")) as {
    requirements: {
      id: string;
      build: string;
      wave: string;
      domain: string;
      title: string;
      text: string;
      status: string;
    }[];
  };
}

export function getScaffoldProgress() {
  const scaffold = loadScaffold();
  const reqs = loadRequirementsRegistry();
  const completedWaves = scaffold.wave_history.filter((w) => w.status === "completed").length;
  return {
    ...scaffold,
    waves_completed_count: completedWaves,
    waves_remaining: scaffold.total_planned_waves - completedWaves,
    requirements_total: reqs.requirements.length,
    requirements_implemented: reqs.requirements.filter((r) => r.status === "implemented").length,
    requirements_documented: reqs.requirements.filter((r) => r.status === "documented").length,
    build_progress_bar: Object.entries(scaffold.builds).map(([id, b]) => ({
      id,
      name: b.name,
      system_id: b.system_id,
      percent: b.percent,
      current_wave: b.current_wave,
    })),
  };
}

export function markWaveComplete(waveId: string, buildId: string, waveName: string) {
  const scaffold = loadScaffold();
  if (scaffold.wave_history.some((w) => w.wave_id === waveId && w.status === "completed")) {
    return scaffold;
  }
  scaffold.wave_history.push({
    wave_id: waveId,
    build: buildId,
    name: waveName,
    completed_at: new Date().toISOString(),
    status: "completed",
  });
  const waveCode = waveId.includes("-W") ? `W${waveId.split("-W")[1]}` : waveId;
  const build = scaffold.builds[buildId];
  if (build && !build.waves_completed.includes(waveCode)) {
    build.waves_completed.push(waveCode);
    build.percent = Math.min(100, build.waves_completed.length * 12.5);
    build.current_wave = build.waves_completed.length < 8 ? `W${build.waves_completed.length + 1}` : null;
  }
  const totalCompleted = scaffold.wave_history.filter((w) => w.status === "completed").length;
  scaffold.phase_overall_percent = Math.round((totalCompleted / scaffold.total_planned_waves) * 10000) / 100;
  scaffold.current_wave = waveId;
  persistScaffold(scaffold);
  return scaffold;
}
