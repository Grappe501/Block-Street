"use client";

import { useState } from "react";
import type { BuildProgress, Phase } from "@/lib/data";
import { StatusBadge, ProgressBar } from "@/components/StatusBadge";
import { PLATFORM } from "@/lib/data";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { AdminPhases } from "@/components/admin/AdminPhases";
import { AdminMission } from "@/components/admin/AdminMission";
import { AdminArchitecture } from "@/components/admin/AdminArchitecture";
import { AdminBuildLog } from "@/components/admin/AdminBuildLog";
import { AdminVersions } from "@/components/admin/AdminVersions";
import { AdminDeployment } from "@/components/admin/AdminDeployment";
import { AdminLaunchReadiness } from "@/components/admin/AdminLaunchReadiness";
import { AdminImplementationDoctrine } from "@/components/admin/AdminImplementationDoctrine";
import { AdminTraceability } from "@/components/admin/AdminTraceability";
import { AdminRegistry } from "@/components/admin/AdminRegistry";
import { AdminOutreachMission } from "@/components/admin/AdminOutreachMission";
import { AdminGrowthModel } from "@/components/admin/AdminGrowthModel";
import { AdminOrganizingModel } from "@/components/admin/AdminOrganizingModel";
import { AdminGuardrails } from "@/components/admin/AdminGuardrails";
import { AdminConstitution } from "@/components/admin/AdminConstitution";
import { AdminNorthStar } from "@/components/admin/AdminNorthStar";
import { AdminDataModel } from "@/components/admin/AdminDataModel";

const TABS = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "phases", label: "Phases", icon: "🗂️" },
  { id: "launch", label: "Launch", icon: "🚀" },
  { id: "engineering", label: "Engineering", icon: "🔧" },
  { id: "traceability", label: "Traceability", icon: "🧭" },
  { id: "registry", label: "Registry", icon: "🗺️" },
  { id: "outreach", label: "Outreach", icon: "📋" },
  { id: "growth", label: "Growth", icon: "🌱" },
  { id: "organizing-model", label: "Organizing", icon: "🔗" },
  { id: "guardrails", label: "Guardrails", icon: "🛡️" },
  { id: "constitution", label: "Constitution", icon: "📜" },
  { id: "north-star", label: "North Star", icon: "⭐" },
  { id: "mission", label: "Mission", icon: "🎯" },
  { id: "architecture", label: "Architecture", icon: "🏗️" },
  { id: "data-model", label: "Data Model", icon: "🗄️" },
  { id: "versions", label: "Versions", icon: "🔢" },
  { id: "build-log", label: "Build Log", icon: "📜" },
  { id: "deployment", label: "Deployment", icon: "🚀" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function AdminDashboard({ progress }: { progress: BuildProgress }) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                Director Workbench
              </p>
              <h1 className="text-2xl font-bold text-slate-900">{PLATFORM.workingName} Build Control</h1>
              <p className="text-sm text-slate-500">
                v{progress.project.version} · Phase {progress.project.currentPhase}: {progress.project.currentPhaseName}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold text-brand-600">{progress.stats.percentComplete}%</p>
                <p className="text-xs text-slate-500">Overall Progress</p>
              </div>
              <div className="w-32">
                <ProgressBar percent={progress.stats.percentComplete} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <nav className="-mb-px flex gap-1 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id !== "phases") setSelectedPhase(null);
                }}
                className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "border-brand-600 text-brand-600"
                    : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                }`}
              >
                <span className="mr-1.5">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        {activeTab === "overview" && <AdminOverview progress={progress} onSelectPhase={(p) => { setSelectedPhase(p); setActiveTab("phases"); }} />}
        {activeTab === "phases" && (
          <AdminPhases
            progress={progress}
            selectedPhase={selectedPhase}
            onSelectPhase={setSelectedPhase}
            onBack={() => setSelectedPhase(null)}
          />
        )}
        {activeTab === "launch" && <AdminLaunchReadiness />}
        {activeTab === "engineering" && <AdminImplementationDoctrine />}
        {activeTab === "traceability" && <AdminTraceability />}
        {activeTab === "registry" && <AdminRegistry />}
        {activeTab === "outreach" && <AdminOutreachMission />}
        {activeTab === "growth" && <AdminGrowthModel />}
        {activeTab === "organizing-model" && <AdminOrganizingModel />}
        {activeTab === "guardrails" && <AdminGuardrails />}
        {activeTab === "constitution" && <AdminConstitution />}
        {activeTab === "north-star" && <AdminNorthStar />}
        {activeTab === "mission" && <AdminMission />}
        {activeTab === "architecture" && <AdminArchitecture />}
        {activeTab === "data-model" && <AdminDataModel progress={progress} />}
        {activeTab === "versions" && <AdminVersions progress={progress} />}
        {activeTab === "build-log" && <AdminBuildLog progress={progress} />}
        {activeTab === "deployment" && <AdminDeployment progress={progress} />}
      </div>
    </div>
  );
}
