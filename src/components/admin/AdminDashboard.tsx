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
import { AdminCommunityIdentity } from "@/components/admin/AdminCommunityIdentity";
import { AdminKnowledgeGovernance } from "@/components/admin/AdminKnowledgeGovernance";
import { AdminDigitalTwinInit } from "@/components/admin/AdminDigitalTwinInit";
import { AdminParticipantJourney } from "@/components/admin/AdminParticipantJourney";
import { AdminPersonalHeadquarters } from "@/components/admin/AdminPersonalHeadquarters";
import { AdminPersonalRelationshipNetwork } from "@/components/admin/AdminPersonalRelationshipNetwork";
import { AdminRelationshipGrowthEngine } from "@/components/admin/AdminRelationshipGrowthEngine";
import { AdminPersonalCommandCenter } from "@/components/admin/AdminPersonalCommandCenter";
import { AdminTrustPrivacySafety } from "@/components/admin/AdminTrustPrivacySafety";
import { AdminPersonalGrowthLeadership } from "@/components/admin/AdminPersonalGrowthLeadership";
import { AdminCommunityRecognitionAppreciation } from "@/components/admin/AdminCommunityRecognitionAppreciation";
import { AdminCommunicationAttentionManagement } from "@/components/admin/AdminCommunicationAttentionManagement";
import { AdminCivicJourneyTimeline } from "@/components/admin/AdminCivicJourneyTimeline";
import { AdminPersonalDigitalTwin } from "@/components/admin/AdminPersonalDigitalTwin";
import { AdminOpportunityBelongingEngine } from "@/components/admin/AdminOpportunityBelongingEngine";
import { AdminParticipantExperienceLifecycle } from "@/components/admin/AdminParticipantExperienceLifecycle";
import { AdminCommunityOperatingSystem } from "@/components/admin/AdminCommunityOperatingSystem";
import { AdminActionOperatingSystem } from "@/components/admin/AdminActionOperatingSystem";
import { AdminMasterArchitectureBible } from "@/components/admin/AdminMasterArchitectureBible";
import { AdminImplementationVolumes } from "@/components/admin/AdminImplementationVolumes";
import { AdminEngineeringArchitecture } from "@/components/admin/AdminEngineeringArchitecture";
import { AdminGrowthOperatingSystem } from "@/components/admin/AdminGrowthOperatingSystem";
import { AdminGrowthModel } from "@/components/admin/AdminGrowthModel";
import { AdminOrganizingModel } from "@/components/admin/AdminOrganizingModel";
import { AdminGuardrails } from "@/components/admin/AdminGuardrails";
import { AdminConstitution } from "@/components/admin/AdminConstitution";
import { AdminNorthStar } from "@/components/admin/AdminNorthStar";
import { AdminDataModel } from "@/components/admin/AdminDataModel";
import { AdminDataArchitecture } from "@/components/admin/AdminDataArchitecture";
import { AdminPlatformBehavior } from "@/components/admin/AdminPlatformBehavior";
import { AdminUserExperience } from "@/components/admin/AdminUserExperience";
import { AdminPlatformServices } from "@/components/admin/AdminPlatformServices";

const TABS = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "volume0", label: "Volume 0", icon: "📖" },
  { id: "factory", label: "Factory", icon: "🏭" },
  { id: "engineering", label: "Volume 1", icon: "⚙️" },
  { id: "phases", label: "Phases", icon: "🗂️" },
  { id: "launch", label: "Launch", icon: "🚀" },
  { id: "engineering", label: "Engineering", icon: "🔧" },
  { id: "traceability", label: "Traceability", icon: "🧭" },
  { id: "registry", label: "Registry", icon: "🗺️" },
  { id: "outreach", label: "Outreach", icon: "📋" },
  { id: "identity", label: "Identity", icon: "🎨" },
  { id: "governance", label: "Governance", icon: "⚖️" },
  { id: "twin", label: "Twin", icon: "🏛️" },
  { id: "journey", label: "Journey", icon: "🧭" },
  { id: "headquarters", label: "HQ", icon: "🏠" },
  { id: "network", label: "Network", icon: "🔗" },
  { id: "rge", label: "Invites", icon: "🤝" },
  { id: "pcc", label: "Command", icon: "🎛️" },
  { id: "trust", label: "Trust", icon: "🔒" },
  { id: "develop", label: "Develop", icon: "🎓" },
  { id: "thanks", label: "Thanks", icon: "💐" },
  { id: "comms", label: "Comms", icon: "📬" },
  { id: "timeline", label: "Timeline", icon: "📖" },
  { id: "pdt", label: "PDT", icon: "🪞" },
  { id: "belonging", label: "Belonging", icon: "🌿" },
  { id: "experience", label: "Experience", icon: "💫" },
  { id: "commos", label: "Comm OS", icon: "🏘️" },
  { id: "actionos", label: "Action OS", icon: "⚡" },
  { id: "growthos", label: "Growth OS", icon: "🌳" },
  { id: "growth", label: "Growth Model", icon: "🌱" },
  { id: "organizing-model", label: "Organizing", icon: "🔗" },
  { id: "guardrails", label: "Guardrails", icon: "🛡️" },
  { id: "constitution", label: "Constitution", icon: "📜" },
  { id: "north-star", label: "North Star", icon: "⭐" },
  { id: "mission", label: "Mission", icon: "🎯" },
  { id: "architecture", label: "Architecture", icon: "🏗️" },
  { id: "data-model", label: "Data Model", icon: "🗄️" },
  { id: "behavior", label: "Volume 3", icon: "⚡" },
  { id: "experience-ux", label: "Volume 4", icon: "✨" },
  { id: "platform-services", label: "Volume 5", icon: "🔌" },
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
        {activeTab === "volume0" && <AdminMasterArchitectureBible />}
        {activeTab === "factory" && <AdminImplementationVolumes />}
        {activeTab === "engineering" && <AdminEngineeringArchitecture />}
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
        {activeTab === "identity" && <AdminCommunityIdentity />}
        {activeTab === "governance" && <AdminKnowledgeGovernance />}
        {activeTab === "twin" && <AdminDigitalTwinInit />}
        {activeTab === "journey" && <AdminParticipantJourney />}
        {activeTab === "headquarters" && <AdminPersonalHeadquarters />}
        {activeTab === "network" && <AdminPersonalRelationshipNetwork />}
        {activeTab === "rge" && <AdminRelationshipGrowthEngine />}
        {activeTab === "pcc" && <AdminPersonalCommandCenter />}
        {activeTab === "trust" && <AdminTrustPrivacySafety />}
        {activeTab === "develop" && <AdminPersonalGrowthLeadership />}
        {activeTab === "thanks" && <AdminCommunityRecognitionAppreciation />}
        {activeTab === "comms" && <AdminCommunicationAttentionManagement />}
        {activeTab === "timeline" && <AdminCivicJourneyTimeline />}
        {activeTab === "pdt" && <AdminPersonalDigitalTwin />}
        {activeTab === "belonging" && <AdminOpportunityBelongingEngine />}
        {activeTab === "experience" && <AdminParticipantExperienceLifecycle />}
        {activeTab === "commos" && <AdminCommunityOperatingSystem />}
        {activeTab === "actionos" && <AdminActionOperatingSystem />}
        {activeTab === "growthos" && <AdminGrowthOperatingSystem />}
        {activeTab === "growth" && <AdminGrowthModel />}
        {activeTab === "organizing-model" && <AdminOrganizingModel />}
        {activeTab === "guardrails" && <AdminGuardrails />}
        {activeTab === "constitution" && <AdminConstitution />}
        {activeTab === "north-star" && <AdminNorthStar />}
        {activeTab === "mission" && <AdminMission />}
        {activeTab === "architecture" && <AdminArchitecture />}
        {activeTab === "data-model" && (
          <div className="space-y-8">
            <AdminDataArchitecture />
            <AdminDataModel progress={progress} />
          </div>
        )}
        {activeTab === "behavior" && <AdminPlatformBehavior />}
        {activeTab === "experience-ux" && <AdminUserExperience />}
        {activeTab === "platform-services" && <AdminPlatformServices />}
        {activeTab === "versions" && <AdminVersions progress={progress} />}
        {activeTab === "build-log" && <AdminBuildLog progress={progress} />}
        {activeTab === "deployment" && <AdminDeployment progress={progress} />}
      </div>
    </div>
  );
}
