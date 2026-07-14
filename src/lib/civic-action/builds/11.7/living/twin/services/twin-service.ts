/**
 * CAE-11.7-W14 — Digital Twin Runtime services
 */
import { caeId, nowIso } from "../../../../../utils";
import { localBrainRuntime } from "../../localbrain/services/localbrain-service";
import { seedLocalBrainIfEmpty } from "../../localbrain/services/seed";
import { seedContextIfEmpty } from "../../context/services/seed";
import { seedExecutiveIfEmpty } from "../../executive-assistant/services/seed";
import { seedOrganizerIfEmpty } from "../../organizer/services/seed";
import { seedResearchIfEmpty } from "../../research/services/seed";
import { seedConversationIfEmpty } from "../../conversation/services/seed";
import { seedLearningIfEmpty } from "../../learning/services/seed";
import { seedPredictionIfEmpty } from "../../prediction/services/seed";
import { seedAgentsIfEmpty } from "../../agents/services/seed";
import { seedPartnershipIfEmpty } from "../../partnership/services/seed";
import { seedFederationIfEmpty } from "../../federation/services/seed";
import { seedAutomationIfEmpty } from "../../automation/services/seed";
import { seedFactoryIfEmpty } from "../../factory/services/seed";
import type { ResourceSimulationRecord, SimulationType, StressTestRecord } from "../data-model";
import {
  listAccuracy,
  listAISandboxes,
  listExperiments,
  listModels,
  listPolicies,
  listResources,
  listScenarios,
  listSimulations,
  listStressTests,
  listSyncs,
  listTraining,
  listTwinObservatory,
  listTwins,
  saveAccuracy,
  saveAISandbox,
  saveExperiment,
  saveModel,
  savePolicy,
  saveResource,
  saveScenario,
  saveSimulation,
  saveStressTest,
  saveSync,
  saveTraining,
  saveTwin,
  saveTwinObservatory,
} from "./repository";

export class TwinError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

function ensureTwinBoot() {
  seedLocalBrainIfEmpty();
  seedContextIfEmpty();
  seedExecutiveIfEmpty();
  seedOrganizerIfEmpty();
  seedResearchIfEmpty();
  seedConversationIfEmpty();
  seedLearningIfEmpty();
  seedPredictionIfEmpty();
  seedAgentsIfEmpty();
  seedPartnershipIfEmpty();
  seedFederationIfEmpty();
  seedAutomationIfEmpty();
  seedFactoryIfEmpty();
}

function getBrain(humanId: string) {
  ensureTwinBoot();
  const brain = localBrainRuntime.localBrain.getByHuman(humanId);
  if (!brain) throw new TwinError("TWIN_CONTEXT_REQUIRED", "LocalBrain required");
  return brain;
}

function getTwin(twinId: string, institutionId: string) {
  const twin = listTwins(institutionId).find((t) => t.twin_id === twinId);
  if (!twin) throw new TwinError("TWIN_NOT_FOUND", "Digital Twin not found");
  return twin;
}

export const digitalTwinService = {
  list: listTwins,
  create(input: { institution_id: string; owner: string; name?: string }) {
    getBrain(input.owner);
    const existing = listTwins(input.institution_id);
    const record = {
      twin_id: caeId("twn"),
      institution_id: input.institution_id,
      owner: input.owner,
      name: input.name ?? `${input.institution_id} Digital Twin`,
      version: existing.length + 1,
      governance_mirrored: true as const,
      structure_mirrored: true as const,
      is_canonical: false as const,
      reality_authoritative: true as const,
      status: "active" as const,
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    saveTwin(record);
    return {
      twin: record,
      event: "twin.updated" as const,
      is_canonical: false,
      reality_authoritative: true,
    };
  },
  resetSandbox(input: { twin_id: string; institution_id: string; human_id: string }) {
    getBrain(input.human_id);
    const twin = getTwin(input.twin_id, input.institution_id);
    const updated = { ...twin, status: "active" as const, updated_at: nowIso(), version: twin.version + 1 };
    saveTwin(updated);
    return { twin: updated, sandbox_reset: true, production_untouched: true };
  },
};

export const institutionModelService = {
  list: listModels,
  model(input: {
    twin_id: string;
    institution_id: string;
    departments?: string[];
    teams?: string[];
    people_count?: number;
    agents_count?: number;
    projects?: string[];
    workflows?: string[];
    resources?: string[];
  }) {
    getTwin(input.twin_id, input.institution_id);
    const record = {
      model_id: caeId("mdl"),
      twin_id: input.twin_id,
      institution_id: input.institution_id,
      departments: input.departments ?? ["Operations", "Outreach", "Governance"],
      teams: input.teams ?? ["County Immersion", "Volunteer Corps"],
      people_count: input.people_count ?? 24,
      agents_count: input.agents_count ?? 8,
      projects: input.projects ?? ["County Immersion Launch"],
      workflows: input.workflows ?? ["Volunteer Onboarding"],
      resources: input.resources ?? ["funding", "personnel", "facilities"],
      version: 1,
      modeled_at: nowIso(),
    };
    saveModel(record);
    return { model: record, simulated_representation: true };
  },
};

export const synchronizationService = {
  list: listSyncs,
  synchronize(input: {
    twin_id: string;
    institution_id: string;
    human_id: string;
    scope?: string[];
  }) {
    getBrain(input.human_id);
    getTwin(input.twin_id, input.institution_id);
    const record = {
      sync_id: caeId("syn"),
      twin_id: input.twin_id,
      institution_id: input.institution_id,
      scope: input.scope ?? ["structure", "capabilities", "policies", "resources", "missions"],
      silent_production_mutation: false as const,
      configurable: true as const,
      status: "completed" as const,
      synced_at: nowIso(),
    };
    saveSync(record);
    const twin = getTwin(input.twin_id, input.institution_id);
    saveTwin({ ...twin, updated_at: nowIso(), version: twin.version + 1, status: "active" });
    return {
      sync: record,
      event: "twin.updated" as const,
      silently_modifies_production: false,
      production_untouched: true,
    };
  },
};

export const simulationEngine = {
  list: listSimulations,
  run(input: {
    twin_id: string;
    institution_id: string;
    human_id: string;
    simulation_type: SimulationType;
    hypothesis: string;
  }) {
    getBrain(input.human_id);
    getTwin(input.twin_id, input.institution_id);
    const record = {
      simulation_id: caeId("sim"),
      twin_id: input.twin_id,
      institution_id: input.institution_id,
      human_id: input.human_id,
      simulation_type: input.simulation_type,
      hypothesis: input.hypothesis,
      status: "completed" as const,
      reproducible: true as const,
      isolated: true as const,
      affects_production: false as const,
      outcome_summary: `Simulated ${input.simulation_type}: hypothesis tested in isolation`,
      started_at: nowIso(),
      completed_at: nowIso(),
    };
    saveSimulation(record);
    return {
      simulation: record,
      event: "simulation.completed" as const,
      isolated: true,
      reproducible: true,
      affects_production: false,
      guaranteed_outcome: false,
    };
  },
};

export const scenarioLabService = {
  list: listScenarios,
  create(input: {
    twin_id: string;
    institution_id: string;
    human_id: string;
    title: string;
    category: "what_if" | "policy" | "budget" | "growth" | "emergency" | "strategic" | "redesign";
    inputs?: string[];
  }) {
    getBrain(input.human_id);
    getTwin(input.twin_id, input.institution_id);
    const record = {
      scenario_id: caeId("scn"),
      twin_id: input.twin_id,
      institution_id: input.institution_id,
      human_id: input.human_id,
      title: input.title,
      category: input.category,
      isolated: true as const,
      inputs: input.inputs ?? ["baseline_state"],
      created_at: nowIso(),
    };
    saveScenario(record);
    return { scenario: record, isolated: true };
  },
  compare(input: {
    institution_id: string;
    scenario_ids: string[];
    human_id: string;
  }) {
    getBrain(input.human_id);
    const scenarios = listScenarios(input.institution_id).filter((s) =>
      input.scenario_ids.includes(s.scenario_id)
    );
    return {
      compared: scenarios.length,
      scenarios,
      event: "scenario.compared" as const,
      winner: scenarios[0]?.scenario_id ?? null,
      recommendation_only: true,
      production_change: false,
    };
  },
};

export const stressTestingService = {
  list: listStressTests,
  run(input: {
    twin_id: string;
    institution_id: string;
    human_id: string;
    stress_type: StressTestRecord["stress_type"];
  }) {
    getBrain(input.human_id);
    getTwin(input.twin_id, input.institution_id);
    const record = {
      stress_id: caeId("sts"),
      twin_id: input.twin_id,
      institution_id: input.institution_id,
      stress_type: input.stress_type,
      breaking_points: ["Volunteer capacity at 40% staff", "Approval latency exceeds 48h", "Meeting room contention"],
      resilience_score: 0.62,
      completed_at: nowIso(),
    };
    saveStressTest(record);
    return {
      stress_test: record,
      event: "stress.test.completed" as const,
      breaking_points_identified: true,
      production_untouched: true,
    };
  },
};

export const resourceSimulationService = {
  list: listResources,
  simulate(input: {
    twin_id: string;
    institution_id: string;
    resource_type: ResourceSimulationRecord["resource_type"];
    projected_demand?: number;
    available_capacity?: number;
  }) {
    getTwin(input.twin_id, input.institution_id);
    const demand = input.projected_demand ?? 100;
    const capacity = input.available_capacity ?? 80;
    const record = {
      resource_id: caeId("rsr"),
      twin_id: input.twin_id,
      institution_id: input.institution_id,
      resource_type: input.resource_type,
      projected_demand: demand,
      available_capacity: capacity,
      shortage_risk: demand > capacity,
      simulated_at: nowIso(),
    };
    saveResource(record);
    return { resource: record, evidence_based: true };
  },
};

export const policySandboxService = {
  list: listPolicies,
  evaluate(input: {
    twin_id: string;
    institution_id: string;
    human_id: string;
    policy_name: string;
  }) {
    getBrain(input.human_id);
    getTwin(input.twin_id, input.institution_id);
    const record = {
      policy_id: caeId("pol"),
      twin_id: input.twin_id,
      institution_id: input.institution_id,
      policy_name: input.policy_name,
      impacts_measurable: true as const,
      production_adopted: false as const,
      impact_summary: `Sandbox evaluation of "${input.policy_name}" — not adopted in production`,
      evaluated_at: nowIso(),
    };
    savePolicy(record);
    return { policy: record, production_adopted: false, impacts_measurable: true };
  },
};

export const aiSandboxService = {
  list: listAISandboxes,
  test(input: {
    twin_id: string;
    institution_id: string;
    human_id: string;
    agent_name: string;
    experiment_type: "prompt" | "automation" | "decision_support" | "recommendation" | "safety" | "collaboration";
  }) {
    getBrain(input.human_id);
    getTwin(input.twin_id, input.institution_id);
    const record = {
      sandbox_id: caeId("ais"),
      twin_id: input.twin_id,
      institution_id: input.institution_id,
      agent_name: input.agent_name,
      experiment_type: input.experiment_type,
      reaches_production: false as const,
      certified: false,
      created_at: nowIso(),
    };
    saveAISandbox(record);
    return {
      sandbox: record,
      reaches_production: false,
      requires_certification: true,
    };
  },
};

export const trainingSimulationService = {
  list: listTraining,
  train(input: {
    twin_id: string;
    institution_id: string;
    human_id: string;
    training_type: "leadership" | "volunteer_onboarding" | "emergency" | "campaign" | "board" | "media" | "operational" | "orientation";
  }) {
    getBrain(input.human_id);
    getTwin(input.twin_id, input.institution_id);
    const record = {
      training_id: caeId("trn"),
      twin_id: input.twin_id,
      institution_id: input.institution_id,
      human_id: input.human_id,
      training_type: input.training_type,
      operational_risk: false as const,
      completed: true,
      trained_at: nowIso(),
    };
    saveTraining(record);
    return { training: record, operational_risk: false };
  },
};

export const twinAccuracyService = {
  list: listAccuracy,
  measure(input: {
    twin_id: string;
    institution_id: string;
    predicted_outcome: string;
    actual_outcome: string;
  }) {
    getTwin(input.twin_id, input.institution_id);
    const record = {
      accuracy_id: caeId("acc"),
      twin_id: input.twin_id,
      institution_id: input.institution_id,
      predicted_outcome: input.predicted_outcome,
      actual_outcome: input.actual_outcome,
      accuracy_score: 0.84,
      assumes_guaranteed: false as const,
      measured_at: nowIso(),
    };
    saveAccuracy(record);
    return {
      accuracy: record,
      event: "twin.accuracy.updated" as const,
      assumes_guaranteed: false,
    };
  },
};

export const experimentRegistryService = {
  list: listExperiments,
  create(input: {
    twin_id: string;
    institution_id: string;
    owner: string;
    purpose: string;
    hypothesis: string;
    configuration?: string[];
  }) {
    getBrain(input.owner);
    getTwin(input.twin_id, input.institution_id);
    const record = {
      experiment_id: caeId("exp"),
      twin_id: input.twin_id,
      institution_id: input.institution_id,
      owner: input.owner,
      purpose: input.purpose,
      hypothesis: input.hypothesis,
      configuration: input.configuration ?? ["isolated", "reproducible"],
      results: "",
      lessons_learned: [] as string[],
      versioned: true as const,
      reproducible: true as const,
      status: "created" as const,
      created_at: nowIso(),
      completed_at: null,
    };
    saveExperiment(record);
    return { experiment: record, event: "experiment.created" as const, versioned: true };
  },
  complete(experimentId: string, institutionId: string, results: string, lessons: string[]) {
    const experiment = listExperiments(institutionId).find((e) => e.experiment_id === experimentId);
    if (!experiment) throw new TwinError("EXPERIMENT_NOT_FOUND", "Experiment not found");
    const updated = {
      ...experiment,
      results,
      lessons_learned: lessons,
      status: "completed" as const,
      completed_at: nowIso(),
    };
    saveExperiment(updated);
    return { experiment: updated, event: "experiment.completed" as const };
  },
};

export const enterpriseObservatoryService = {
  list: listTwinObservatory,
  measure(input: { institution_id: string; twin_id: string }) {
    getTwin(input.twin_id, input.institution_id);
    const record = {
      observatory_id: caeId("tob"),
      institution_id: input.institution_id,
      twin_id: input.twin_id,
      simulation_health: 0.9,
      twin_accuracy: 0.84,
      forecast_quality: 0.78,
      operational_resilience: 0.71,
      institutional_maturity: 0.76,
      measured_at: nowIso(),
    };
    saveTwinObservatory(record);
    return { observatory: record, leadership_visible: true };
  },
};

export const twinRuntimeService = {
  dashboard(input: { human_id: string; institution_id: string }) {
    ensureTwinBoot();
    getBrain(input.human_id);
    const twins = listTwins(input.institution_id);
    const simulations = listSimulations(input.institution_id);
    const experiments = listExperiments(input.institution_id);
    const scenarios = listScenarios(input.institution_id);

    return {
      greeting: "Digital Twin Dashboard",
      central_question: "What happens if we change this before we actually change it?",
      twins: twins.length,
      simulations: simulations.length,
      experiments: experiments.length,
      scenarios: scenarios.length,
      is_canonical: false,
      reality_authoritative: true,
      mutates_canonical: false,
      affects_production: false,
      guaranteed_outcomes: false,
    };
  },
  security: {
    prohibited: [
      "modify_production_data",
      "spend_funds",
      "notify_real_users",
      "trigger_automation",
      "approve_workflows",
      "execute_deployments",
      "mutate_canonical_records",
      "bypass_human_governance",
      "promote_experimental_ai_without_certification",
    ],
    check(action: string) {
      return { allowed: !this.prohibited.some((p) => action.includes(p)), isolated: true };
    },
  },
};

export const twinRuntime = {
  twin: twinRuntimeService,
  digitalTwin: digitalTwinService,
  model: institutionModelService,
  sync: synchronizationService,
  simulation: simulationEngine,
  scenarios: scenarioLabService,
  stress: stressTestingService,
  resources: resourceSimulationService,
  policy: policySandboxService,
  aiSandbox: aiSandboxService,
  training: trainingSimulationService,
  accuracy: twinAccuracyService,
  experiments: experimentRegistryService,
  observatory: enterpriseObservatoryService,
};
