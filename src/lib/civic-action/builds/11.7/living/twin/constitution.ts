/**
 * CAE-11.7-W14 — Digital Twin Constitution (LIX-014)
 */
export const LIX_TWIN_PRINCIPLE =
  "Experiment in simulation. Execute only after Human approval.";

export const SIMULATION_TYPES = [
  "discrete_event",
  "workflow",
  "timeline_replay",
  "resource",
  "operational",
  "strategic",
  "emergency",
  "election",
  "community",
  "institutional_growth",
] as const;

export const TWIN_MAY = [
  "model_institutional_structure",
  "synchronize_from_reality",
  "run_isolated_simulations",
  "create_scenario_experiments",
  "stress_test_operations",
  "evaluate_policies_in_sandbox",
  "test_ai_behavior_safely",
  "train_humans_without_risk",
  "measure_twin_accuracy",
  "register_experiments",
] as const;

export const TWIN_MAY_NOT = [
  "modify_production_data",
  "spend_funds",
  "notify_real_users",
  "publish_communications",
  "trigger_automation",
  "approve_workflows",
  "execute_deployments",
  "mutate_canonical_records",
  "bypass_human_governance",
  "promote_experimental_ai_without_certification",
  "treat_simulation_as_guaranteed_outcome",
] as const;

export const REQUIRED_TWIN_SERVICES = [
  "DigitalTwinService",
  "InstitutionModelService",
  "SynchronizationService",
  "SimulationEngine",
  "ScenarioLabService",
  "StressTestingService",
  "ResourceSimulationService",
  "PolicySandboxService",
  "AISandboxService",
  "TrainingSimulationService",
  "TwinAccuracyService",
  "ExperimentRegistryService",
  "EnterpriseObservatoryService",
] as const;

export function getTwinConstitution() {
  return {
    protocol_id: "CAE-11.7-W14",
    governing_principle: LIX_TWIN_PRINCIPLE,
    simulation_types: SIMULATION_TYPES,
    may: TWIN_MAY,
    may_not: TWIN_MAY_NOT,
    required_services: REQUIRED_TWIN_SERVICES,
    reality_authoritative: true,
    twin_is_canonical: false,
  };
}
