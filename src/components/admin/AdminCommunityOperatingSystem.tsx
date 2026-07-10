"use client";

import cos from "../../../data/community/community-operating-system.json";
import ccn from "../../../data/registry/community-constitution.json";
import cgs from "../../../data/registry/community-growth-sustainability.json";
import ccc from "../../../data/registry/community-command-center.json";
import twg from "../../../data/registry/team-working-group-system.json";
import mps from "../../../data/registry/mission-project-system.json";
import tsos from "../../../data/registry/time-scheduling-operating-system.json";
import ccnet from "../../../data/registry/community-communication-network.json";
import ckls from "../../../data/registry/community-knowledge-learning-system.json";
import cce from "../../../data/registry/community-capability-exchange.json";
import cis from "../../../data/registry/community-intelligence-system.json";
import scn from "../../../data/registry/statewide-collaboration-network.json";
import oex from "../../../data/registry/opportunity-exchange.json";
import cls from "../../../data/registry/community-legacy-system.json";
import cosCert from "../../../data/registry/community-operating-system-certification.json";

export function AdminCommunityOperatingSystem() {
  const doneSteps = cos.steps.filter((s) => s.status === "done").length;

  return (
    <div className="space-y-6">
      <div className="card border-teal-300 bg-teal-50">
        <p className="text-xs font-semibold uppercase text-teal-800">PHASE-004 · Community Operating System</p>
        <h2 className="mt-1 text-xl font-bold text-teal-950">{ccn.motto}</h2>
        <p className="mt-2 text-sm font-medium text-teal-900">{ccn.principle}</p>
        <p className="mt-2 text-xs italic text-teal-700">Movement infrastructure — required reading for Burt</p>
      </div>

      <div className="card border-violet-200 bg-violet-50">
        <h2 className="text-lg font-bold text-violet-950">Constitutional Hierarchy [CCN-M03]</h2>
        <div className="mt-3 space-y-1 font-mono text-sm text-violet-900">
          {ccn.constitutionalHierarchy.map((layer, i) => (
            <div key={layer.layer} className="flex items-center gap-2">
              {i > 0 && <span className="text-violet-400">↓</span>}
              <span className="font-semibold capitalize">{layer.layer.replace(/([A-Z])/g, " $1").trim()}</span>
              <span className="text-xs text-violet-600">({layer.ref})</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card border-brand-200 bg-brand-50">
        <h2 className="text-lg font-bold text-brand-950">Community Charters [CCN-M17]</h2>
        <p className="mt-1 text-sm text-brand-800">{ccn.communityCharters.description}</p>
        <p className="mt-2 text-xs text-brand-700">
          <strong>Constitution:</strong> {ccn.communityCharters.constitutionVsCharter.constitution}
        </p>
        <p className="mt-1 text-xs text-brand-700">
          <strong>Charter:</strong> {ccn.communityCharters.constitutionVsCharter.charter}
        </p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-brand-900">
          {ccn.communityCharters.elements.slice(0, 6).map((el) => (
            <li key={el}>{el.replace(/([A-Z])/g, " $1").trim()}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Community Rights [CCN-M07]</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {ccn.communityRights.slice(0, 6).map((r) => (
            <span key={r} className="badge bg-emerald-100 text-emerald-900 text-xs capitalize">
              {r.replace(/([A-Z])/g, " $1").trim()}
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Equal Standing [CCN-M05]</h2>
        <p className="mt-1 text-sm text-slate-700">
          Same architectural support for every community — differs by participation, not importance.
        </p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Phase 4 Steps</h2>
        <div className="mt-2 space-y-1 text-sm">
          {cos.steps.map((s) => (
            <div key={s.id} className="flex items-center gap-2">
              <span className={s.status === "done" ? "text-emerald-600" : "text-slate-400"}>
                {s.status === "done" ? "✓" : "○"}
              </span>
              <span className="font-mono text-xs text-slate-500">{s.id}</span>
              <span className="text-slate-800">{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card border-slate-200 bg-slate-50">
        <p className="text-xs font-semibold uppercase text-slate-700">Progress</p>
        <p className="mt-1 text-sm text-slate-900">{doneSteps}/{cos.steps.length} Phase 4 steps</p>
      </div>

      <div className="card border-emerald-300 bg-emerald-50">
        <p className="text-xs font-semibold uppercase text-emerald-800">PHASE-004.2 · Growth & Sustainability · Required Reading</p>
        <h2 className="mt-1 text-xl font-bold text-emerald-950">{cgs.motto}</h2>
        <p className="mt-2 text-sm font-medium text-emerald-900">{cgs.principle}</p>
        <p className="mt-2 text-xs italic text-emerald-700">{cgs.objective}</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Community Lifecycle [CGS-M04]</h2>
        <p className="mt-1 text-xs text-slate-600">Living organisms — never assume permanent &ldquo;active&rdquo;</p>
        <div className="mt-3 space-y-2">
          {cgs.lifecycleStages.map((s) => (
            <div key={s.key} className="rounded-lg border border-slate-200 p-3 text-sm">
              <span className="font-semibold text-slate-900">
                {s.stage}. {s.label}
                {s.notFailure && (
                  <span className="ml-2 text-xs font-normal text-amber-700">— renewal, not failure</span>
                )}
              </span>
              <p className="mt-1 text-xs text-slate-600">{s.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card border-amber-200 bg-amber-50">
        <h2 className="text-lg font-bold text-amber-950">Community Health Check [CGS-M12]</h2>
        <p className="mt-1 text-sm text-amber-800">{cgs.communityHealthCheck.description}</p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-amber-900">
          {cgs.communityHealthCheck.questions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Sustainability Principles [CGS-M05]</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {cgs.sustainabilityPrinciples.map((p) => (
            <span key={p} className="badge bg-teal-100 text-teal-900 text-xs capitalize">
              {p.replace(/([A-Z])/g, " $1").trim()}
            </span>
          ))}
        </div>
      </div>

      <div className="card border-violet-200 bg-violet-50">
        <h2 className="text-lg font-bold text-violet-950">Leadership Succession [CGS-M06]</h2>
        <p className="mt-1 text-xs text-violet-700">
          {cgs.leadershipSuccession.neverDependOnOneIndividual ? "Never depend on one individual" : ""}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {cgs.leadershipSuccession.methods.map((m) => (
            <span key={m} className="badge bg-violet-100 text-violet-900 text-xs capitalize">
              {m.replace(/([A-Z])/g, " $1").trim()}
            </span>
          ))}
        </div>
      </div>

      <div className="card border-sky-300 bg-sky-50">
        <p className="text-xs font-semibold uppercase text-sky-800">PHASE-004.3 · Community Command Center · Required Reading</p>
        <h2 className="mt-1 text-xl font-bold text-sky-950">{ccc.motto}</h2>
        <p className="mt-2 text-sm font-medium text-sky-900">{ccc.principle}</p>
        <p className="mt-2 text-xs italic text-sky-700">PCC parallel — {ccc.pccParallel.communityPulse}</p>
      </div>

      <div className="card border-indigo-200 bg-indigo-50">
        <h2 className="text-lg font-bold text-indigo-950">Community Pulse [CCC-M20]</h2>
        <p className="mt-1 text-sm text-indigo-800">{ccc.communityPulse.description}</p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-indigo-900">
          {ccc.communityPulse.exampleItems.slice(0, 5).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Command Center Widgets [CCC-M06–M18]</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {ccc.widgets.map((w) => (
            <span
              key={w.key}
              className={`badge text-xs ${w.signatureFeature ? "bg-indigo-100 text-indigo-900 font-semibold" : "bg-slate-100 text-slate-800"}`}
            >
              {w.label}
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Six Visit Questions [CCC-M04]</h2>
        <ul className="mt-2 space-y-1 text-sm text-slate-800">
          {ccc.sixQuestions.map((q) => (
            <li key={q.question}>
              <span className="font-semibold">{q.question}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Quick Actions [CCC-M17]</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {ccc.quickActions.filter((a) => a.v1).map((a) => (
            <span key={a.id} className="badge bg-sky-100 text-sky-900 text-xs">
              {a.label}
            </span>
          ))}
          {ccc.quickActions.filter((a) => !a.v1).map((a) => (
            <span key={a.id} className="badge bg-slate-100 text-slate-500 text-xs">
              {a.label}
            </span>
          ))}
        </div>
      </div>

      <div className="card border-orange-300 bg-orange-50">
        <p className="text-xs font-semibold uppercase text-orange-800">PHASE-004.4 · Team & Working Group · Required Reading</p>
        <h2 className="mt-1 text-xl font-bold text-orange-950">{twg.motto}</h2>
        <p className="mt-2 text-sm font-medium text-orange-900">{twg.principle}</p>
        <p className="mt-2 text-xs italic text-orange-700">
          {twg.philosophy.communitiesProvide} → {twg.philosophy.teamsProvide} → {twg.philosophy.missionsProvide}
        </p>
      </div>

      <div className="card border-rose-200 bg-rose-50">
        <h2 className="text-lg font-bold text-rose-950">Micro Teams [TWG-M16]</h2>
        <p className="mt-1 text-sm text-rose-800">{twg.microTeams.description}</p>
        <p className="mt-2 text-xs text-rose-700">{twg.microTeams.philosophy}</p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-rose-900">
          {twg.microTeams.examples.slice(0, 4).map((ex) => (
            <li key={ex}>{ex}</li>
          ))}
        </ul>
        <p className="mt-2 text-xs font-mono text-rose-600">Evolution: {twg.microTeams.evolutionPath}</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Team Types [TWG-M04]</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {twg.teamTypes.map((t) => (
            <span
              key={t.key}
              className={`badge text-xs ${t.signatureType ? "bg-rose-100 text-rose-900 font-semibold" : "bg-orange-100 text-orange-900"}`}
            >
              {t.label}
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Team Lifecycle [TWG-M06]</h2>
        <div className="mt-2 space-y-1 font-mono text-sm text-slate-800">
          {twg.teamLifecycle.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              {i > 0 && <span className="text-slate-400">↓</span>}
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Leadership Roles [TWG-M09]</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {twg.leadership.roles.map((r) => (
            <span key={r} className="badge bg-slate-100 text-slate-800 text-xs capitalize">
              {r.replace(/([A-Z])/g, " $1").trim()}
            </span>
          ))}
        </div>
      </div>

      <div className="card border-purple-300 bg-purple-50">
        <p className="text-xs font-semibold uppercase text-purple-800">PHASE-004.5 · Mission & Project · Required Reading</p>
        <h2 className="mt-1 text-xl font-bold text-purple-950">{mps.motto}</h2>
        <p className="mt-2 text-sm font-medium text-purple-900">{mps.principle}</p>
        <p className="mt-2 text-xs font-mono text-purple-700">
          {mps.philosophy.missionAnswers} · {mps.philosophy.projectAnswers} · {mps.philosophy.tasksAnswer}
        </p>
      </div>

      <div className="card border-fuchsia-200 bg-fuchsia-50">
        <h2 className="text-lg font-bold text-fuchsia-950">Mission Canvas [MPS-M15]</h2>
        <p className="mt-1 text-sm text-fuchsia-800">{mps.missionCanvas.description}</p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-fuchsia-900">
          {mps.missionCanvas.questions.slice(0, 5).map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
        <p className="mt-2 text-xs italic text-fuchsia-700">{mps.missionCanvas.philosophy}</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Mission Types [MPS-M04]</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {mps.missionTypes.filter((t) => !t.future).map((t) => (
            <span key={t.key} className="badge bg-purple-100 text-purple-900 text-xs">
              {t.label}
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Project Lifecycle [MPS-M05]</h2>
        <div className="mt-2 space-y-1 font-mono text-sm text-slate-800">
          {mps.projectLifecycle.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              {i > 0 && <span className="text-slate-400">↓</span>}
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Mission Statement Examples [MPS-M07]</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-800">
          {mps.missionStatement.examples.map((ex) => (
            <li key={ex}>&ldquo;{ex}&rdquo;</li>
          ))}
        </ul>
      </div>

      <div className="card border-cyan-300 bg-cyan-50">
        <p className="text-xs font-semibold uppercase text-cyan-800">PHASE-004.6 · Time & Scheduling OS · Foundational Engine</p>
        <h2 className="mt-1 text-xl font-bold text-cyan-950">{tsos.motto}</h2>
        <p className="mt-2 text-sm font-medium text-cyan-900">{tsos.principle}</p>
        <p className="mt-2 text-xs italic text-cyan-700">{tsos.philosophy.newQuestion}</p>
      </div>

      <div className="card border-teal-200 bg-teal-50">
        <h2 className="text-lg font-bold text-teal-950">Rhythm Engine [TSOS-M16]</h2>
        <p className="mt-1 text-sm text-teal-800">{tsos.rhythmEngine.description}</p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-teal-900">
          {tsos.rhythmEngine.examples.slice(0, 4).map((ex) => (
            <li key={ex}>{ex}</li>
          ))}
        </ul>
        <p className="mt-2 text-xs italic text-teal-700">{tsos.rhythmEngine.philosophy}</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Master Timeline Item Types [TSOS-M04]</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {tsos.masterTimeline.itemTypes.map((t) => (
            <span key={t} className="badge bg-cyan-100 text-cyan-900 text-xs capitalize">
              {t.replace(/([A-Z])/g, " $1").trim()}
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Personal Views [TSOS-M05]</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {tsos.personalViews.examples.map((v) => (
            <span key={v} className="badge bg-slate-100 text-slate-800 text-xs capitalize">
              {v.replace(/([A-Z])/g, " $1").trim()}
            </span>
          ))}
        </div>
      </div>

      <div className="card border-lime-300 bg-lime-50">
        <p className="text-xs font-semibold uppercase text-lime-800">PHASE-004.7 · Communication Network · Major Engine</p>
        <h2 className="mt-1 text-xl font-bold text-lime-950">{ccnet.motto}</h2>
        <p className="mt-2 text-sm font-medium text-lime-900">{ccnet.principle}</p>
        <p className="mt-2 text-xs italic text-lime-700">{ccnet.requirementId} · distinct from CCN-001 Constitution</p>
      </div>

      <div className="card border-green-200 bg-green-50">
        <h2 className="text-lg font-bold text-green-950">Conversation Graph [CCNET-M13]</h2>
        <p className="mt-1 text-sm text-green-800">{ccnet.conversationGraph.description}</p>
        <p className="mt-2 text-xs italic text-green-700">{ccnet.conversationGraph.institutionalMemory}</p>
        <ul className="mt-3 space-y-1 font-mono text-xs text-green-900">
          {ccnet.conversationGraph.exampleChain.map((step) => (
            <li key={step}>→ {step.replace(/([A-Z])/g, " $1").trim()}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Communication Types [CCNET-M04]</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {ccnet.communicationTypes.map((t) => (
            <span key={t.key} className="badge bg-lime-100 text-lime-900 text-xs">
              {t.label}
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Default Spaces [CCNET-M05]</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {ccnet.communicationSpaces.defaultChannels.map((c) => (
            <span key={c} className="badge bg-slate-100 text-slate-800 text-xs capitalize">
              {c.replace(/([A-Z])/g, " $1").trim()}
            </span>
          ))}
        </div>
      </div>

      <div className="card border-yellow-300 bg-yellow-50">
        <p className="text-xs font-semibold uppercase text-yellow-800">PHASE-004.8 · Knowledge & Learning · Living Asset</p>
        <h2 className="mt-1 text-xl font-bold text-yellow-950">{ckls.motto}</h2>
        <p className="mt-2 text-sm font-medium text-yellow-900">{ckls.principle}</p>
        <p className="mt-2 text-xs italic text-yellow-700">KDG-001 governs · CKLS-001 implements</p>
      </div>

      <div className="card border-amber-200 bg-amber-50">
        <h2 className="text-lg font-bold text-amber-950">Community Brain [CKLS-M15]</h2>
        <p className="mt-1 text-sm text-amber-800">{ckls.communityBrain.description}</p>
        <p className="mt-2 text-xs text-amber-700">Parallel to PDT-001 · {ckls.communityBrain.philosophy}</p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-amber-900">
          {ckls.communityBrain.exampleQueries.map((q) => (
            <li key={q}>&ldquo;{q}&rdquo;</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Knowledge Categories [CKLS-M04]</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {ckls.knowledgeCategories.slice(0, 8).map((c) => (
            <span key={c.key} className="badge bg-yellow-100 text-yellow-900 text-xs">
              {c.label}
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Playbooks [CKLS-M07]</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-800">
          {ckls.playbooks.examples.map((ex) => (
            <li key={ex} className="capitalize">{ex.replace(/([A-Z])/g, " $1").trim()}</li>
          ))}
        </ul>
      </div>

      <div className="card border-stone-300 bg-stone-50">
        <p className="text-xs font-semibold uppercase text-stone-800">PHASE-004.9 · Capability Exchange · Statewide Network</p>
        <h2 className="mt-1 text-xl font-bold text-stone-950">{cce.motto}</h2>
        <p className="mt-2 text-sm font-medium text-stone-900">{cce.principle}</p>
        <p className="mt-2 text-xs italic text-stone-700">Capabilities not files — people, tools, spaces, skills</p>
      </div>

      <div className="card border-neutral-200 bg-neutral-50">
        <h2 className="text-lg font-bold text-neutral-950">Capability Graph [CCE-M13]</h2>
        <p className="mt-1 text-sm text-neutral-800">{cce.capabilityGraph.description}</p>
        <ul className="mt-3 space-y-2 text-sm text-neutral-900">
          {cce.capabilityGraph.exampleChains.map((ex) => (
            <li key={ex.label}>
              <span className="font-semibold">{ex.label}:</span>{" "}
              {ex.chain.join(" → ")}
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Capability Categories [CCE-M04]</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {cce.capabilityCategories.map((c) => (
            <span key={c.key} className="badge bg-stone-200 text-stone-900 text-xs">
              {c.label}
            </span>
          ))}
        </div>
      </div>

      <div className="card border-indigo-300 bg-indigo-50">
        <p className="text-xs font-semibold uppercase text-indigo-800">PHASE-004.10 · Intelligence System · Decision Support</p>
        <h2 className="mt-1 text-xl font-bold text-indigo-950">{cis.motto}</h2>
        <p className="mt-2 text-sm font-medium text-indigo-900">{cis.principle}</p>
        <p className="mt-2 text-xs italic text-indigo-700">Intelligence not analytics — helps communities decide what to do next</p>
      </div>

      <div className="card border-indigo-200 bg-indigo-50/50">
        <h2 className="text-lg font-bold text-indigo-950">Community Coach [CIS-M14]</h2>
        <p className="mt-1 text-sm text-indigo-900">{cis.communityCoach.description}</p>
        <ul className="mt-3 space-y-2 text-sm text-indigo-950">
          {cis.communityCoach.exampleMessages.slice(0, 3).map((msg) => (
            <li key={msg} className="italic">&ldquo;{msg}&rdquo;</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Intelligence Categories [CIS-M04]</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {cis.intelligenceCategories.map((c) => (
            <span key={c.key} className="badge bg-indigo-100 text-indigo-900 text-xs">
              {c.label}
            </span>
          ))}
        </div>
      </div>

      <div className="card border-emerald-300 bg-emerald-50">
        <p className="text-xs font-semibold uppercase text-emerald-800">PHASE-004.11 · Statewide Collaboration · Connective Tissue</p>
        <h2 className="mt-1 text-xl font-bold text-emerald-950">{scn.motto}</h2>
        <p className="mt-2 text-sm font-medium text-emerald-900">{scn.principle}</p>
        <p className="mt-2 text-xs italic text-emerald-700">One statewide network — not 75 separate counties</p>
      </div>

      <div className="card border-emerald-200 bg-emerald-50/50">
        <h2 className="text-lg font-bold text-emerald-950">Arkansas Collaboration Map [SCN-M14]</h2>
        <p className="mt-1 text-sm text-emerald-900">{scn.arkansasCollaborationMap.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {scn.arkansasCollaborationMap.filters.slice(0, 5).map((f) => (
            <span key={f} className="badge bg-emerald-100 text-emerald-900 text-xs capitalize">
              {f.replace(/([A-Z])/g, " $1").trim()}
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Collaboration Levels [SCN-M04]</h2>
        <ul className="mt-2 space-y-1 text-sm text-slate-800">
          {scn.collaborationLevels.map((level) => (
            <li key={level.key}>
              <span className="font-semibold">{level.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card border-amber-300 bg-amber-50">
        <p className="text-xs font-semibold uppercase text-amber-800">PHASE-004.12 · Opportunity Exchange · Living Ecosystem</p>
        <h2 className="mt-1 text-xl font-bold text-amber-950">{oex.motto}</h2>
        <p className="mt-2 text-sm font-medium text-amber-900">{oex.principle}</p>
        <p className="mt-2 text-xs italic text-amber-700">Not a job board — connects people with meaningful opportunities</p>
      </div>

      <div className="card border-amber-200 bg-amber-50/50">
        <h2 className="text-lg font-bold text-amber-950">Community Needs Index [OEX-M13]</h2>
        <p className="mt-1 text-sm text-amber-900">{oex.communityNeedsIndex.description}</p>
        <p className="mt-2 text-xs text-amber-800">
          <strong>{oex.communityNeedsIndex.exampleMatch.community}:</strong>{" "}
          {oex.communityNeedsIndex.exampleMatch.needs.join(" · ")} → matches statewide capabilities
        </p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Opportunity Categories [OEX-M04]</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {oex.opportunityCategories.map((c) => (
            <span key={c.key} className="badge bg-amber-100 text-amber-900 text-xs">
              {c.label}
            </span>
          ))}
        </div>
      </div>

      <div className="card border-rose-300 bg-rose-50">
        <p className="text-xs font-semibold uppercase text-rose-800">PHASE-004.13 · Legacy System · Institutional Memory</p>
        <h2 className="mt-1 text-xl font-bold text-rose-950">{cls.motto}</h2>
        <p className="mt-2 text-sm font-medium text-rose-900">{cls.principle}</p>
        <p className="mt-2 text-xs italic text-rose-700">Legacy carries the past into the future — not just memory</p>
      </div>

      <div className="card border-rose-200 bg-rose-50/50">
        <h2 className="text-lg font-bold text-rose-950">Arkansas Living History [CLS-M10]</h2>
        <p className="mt-1 text-sm text-rose-900">{cls.arkansasLivingHistory.description}</p>
        <p className="mt-2 text-xs text-rose-800">{cls.arkansasLivingHistory.ongoingStoryBeyondGraduation ? "Part of an ongoing story — before and after graduation" : ""}</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Legacy Categories [CLS-M04]</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {cls.legacyCategories.map((c) => (
            <span key={c.key} className="badge bg-rose-100 text-rose-900 text-xs">
              {c.label}
            </span>
          ))}
        </div>
      </div>

      <div className="card border-slate-400 bg-slate-100">
        <p className="text-xs font-semibold uppercase text-slate-700">PHASE-004.14 · OS Certification · Phase 4 Complete</p>
        <h2 className="mt-1 text-xl font-bold text-slate-950">{cosCert.motto}</h2>
        <p className="mt-2 text-sm font-medium text-slate-900">{cosCert.certificationQuestion}</p>
        <p className="mt-2 text-xs italic text-slate-600">Finish line for every community — not a ranking system</p>
      </div>

      <div className="card border-slate-300 bg-white">
        <h2 className="text-lg font-bold text-slate-950">Arkansas Network Health Dashboard [COS-M09]</h2>
        <p className="mt-1 text-sm text-slate-800">{cosCert.arkansasNetworkHealthDashboard.description}</p>
        <ul className="mt-3 space-y-1 text-xs text-slate-700">
          {cosCert.arkansasNetworkHealthDashboard.livingNetworkShows.map((item) => (
            <li key={item} className="capitalize">{item.replace(/([A-Z])/g, " $1").trim()}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Certification Levels [COS-M05]</h2>
        <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-slate-800">
          {cosCert.certificationLevels.map((lvl) => (
            <li key={lvl.key}>
              <span className="font-semibold">{lvl.label}</span>
            </li>
          ))}
        </ol>
      </div>

      <p className="text-sm text-slate-500">
        docs/phase-04/COMMUNITY_OPERATING_SYSTEM_CERTIFICATION.md · COS-001 · PHASE_4_COMMUNITY_OS_BUILD_BIBLE.md
      </p>
    </div>
  );
}
