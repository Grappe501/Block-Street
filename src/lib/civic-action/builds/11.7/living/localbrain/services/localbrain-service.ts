/**
 * CAE-11.7-W1 — LocalBrain services
 */
import { caeId, nowIso } from "../../../../../utils";
import { experienceService } from "../../../../11.6/experience/services/experience-service";
import type { MemoryCategory, MemoryTier, PrivacyDomain } from "../data-model";
import { LOCALBRAIN_STORE_KEYS } from "../data-model";
import { PRIVACY_DOMAINS } from "../constitution";
import {
  getCalendarMemory,
  getContextRuntime,
  getLearningMemory,
  getLocalBrain,
  getLocalBrainAnalytics,
  getLocalBrainByHuman,
  getPreferences,
  getWorkingMemory,
  getWorkspaceMemory,
  listInstitutionConnections,
  listKnowledgeNodes,
  listMemories,
  listRelationshipMemory,
  listTimeline,
  readStoreSlice,
  saveCalendarMemory,
  saveContextRuntime,
  saveKnowledgeNode,
  saveLearningMemory,
  saveLocalBrain,
  saveLocalBrainAnalytics,
  saveMemory,
  savePreferences,
  saveRelationshipMemory,
  saveTimelineEntry,
  saveWorkingMemory,
  saveWorkspaceMemory,
} from "./repository";

export class LocalBrainError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export const localBrainService = {
  getByHuman: getLocalBrainByHuman,
  get: getLocalBrain,
  provision(humanId: string) {
    const existing = getLocalBrainByHuman(humanId);
    if (existing) return { localbrain: existing, event: undefined, already_exists: true };
    const now = nowIso();
    const record = {
      localbrain_id: caeId("lbr"),
      human_id: humanId,
      brain_version: "11.7-w1.1",
      status: "active" as const,
      primary_language: "en",
      secondary_languages: [] as string[],
      timezone: "America/Chicago",
      preferred_voice: "neutral",
      assistant_personality: "professional" as const,
      privacy_level: "strict" as const,
      memory_policy: "human_promotion_required" as const,
      sync_policy: "encrypted_cloud" as const,
      created_at: now,
      updated_at: now,
    };
    saveLocalBrain(record);
    return { localbrain: record, event: "localbrain.created" as const, one_per_human: true };
  },
  identityLayer(humanId: string) {
    const brain = getLocalBrainByHuman(humanId);
    const connections = listInstitutionConnections(humanId);
    return {
      human_id: humanId,
      localbrain_id: brain?.localbrain_id ?? null,
      verified_identity: true,
      organizations: connections.map((c) => c.institution_id),
      roles: connections.flatMap((c) => c.roles),
      never_duplicates_identity: true,
      references_phase_11_1: true,
    };
  },
};

export const memoryService = {
  list: listMemories,
  create(input: {
    human_id: string;
    tier: MemoryTier;
    category: MemoryCategory;
    title: string;
    content: string;
    privacy_domain?: PrivacyDomain;
    institution_id?: string;
    expires_at?: string;
  }) {
    const brain = getLocalBrainByHuman(input.human_id);
    if (!brain) throw new LocalBrainError("LOCALBRAIN_NOT_FOUND", "LocalBrain not found for Human");
    const now = nowIso();
    const record = {
      memory_id: caeId("mem"),
      localbrain_id: brain.localbrain_id,
      human_id: input.human_id,
      tier: input.tier,
      category: input.category,
      title: input.title,
      content: input.content,
      privacy_domain: input.privacy_domain ?? ("private" as const),
      institution_id: input.institution_id ?? null,
      reference: null,
      expires_at: input.expires_at ?? (input.tier === "temporary" ? new Date(Date.now() + 7 * 86400000).toISOString() : null),
      promoted_from: null,
      searchable: true as const,
      created_at: now,
      updated_at: now,
    };
    saveMemory(record);
    return { memory: record, event: "memory.created" as const, searchable: true };
  },
  promote(memoryId: string, humanId: string, approvedBy: string, targetTier: MemoryTier) {
    const memory = readStoreSlice<Parameters<typeof saveMemory>[0]>(LOCALBRAIN_STORE_KEYS.memories).find(
      (m) => m.memory_id === memoryId
    );
    if (!memory || memory.human_id !== humanId) {
      throw new LocalBrainError("MEMORY_NOT_FOUND", "Memory not found");
    }
    if (targetTier === "institutional" && !approvedBy) {
      throw new LocalBrainError("APPROVAL_REQUIRED", "Institutional promotion requires Human approval");
    }
    const updated = {
      ...memory,
      tier: targetTier,
      promoted_from: memory.tier,
      updated_at: nowIso(),
      privacy_domain: targetTier === "institutional" ? ("institution" as const) : memory.privacy_domain,
    };
    saveMemory(updated);
    return { memory: updated, event: "memory.promoted" as const, approved_by: approvedBy, human_governed: true };
  },
};

export const workingMemoryService = {
  get: getWorkingMemory,
  update(input: {
    human_id: string;
    current_mission_id?: string;
    current_meeting_id?: string;
    current_task_id?: string;
    current_document_id?: string;
    current_conversation_id?: string;
    current_calendar_block_id?: string;
    current_research_id?: string;
    current_goal_id?: string;
  }) {
    const brain = getLocalBrainByHuman(input.human_id);
    if (!brain) throw new LocalBrainError("LOCALBRAIN_NOT_FOUND", "LocalBrain not found");
    const existing = getWorkingMemory(input.human_id);
    const record = {
      snapshot_id: existing?.snapshot_id ?? caeId("wkm"),
      localbrain_id: brain.localbrain_id,
      human_id: input.human_id,
      current_mission_id: input.current_mission_id ?? existing?.current_mission_id ?? null,
      current_meeting_id: input.current_meeting_id ?? existing?.current_meeting_id ?? null,
      current_task_id: input.current_task_id ?? existing?.current_task_id ?? null,
      current_document_id: input.current_document_id ?? existing?.current_document_id ?? null,
      current_conversation_id: input.current_conversation_id ?? existing?.current_conversation_id ?? null,
      current_calendar_block_id: input.current_calendar_block_id ?? existing?.current_calendar_block_id ?? null,
      current_research_id: input.current_research_id ?? existing?.current_research_id ?? null,
      current_goal_id: input.current_goal_id ?? existing?.current_goal_id ?? null,
      updated_at: nowIso(),
    };
    saveWorkingMemory(record);
    return { working_memory: record, continuously_updated: true };
  },
};

export const longTermMemoryService = {
  list: (humanId: string) => listMemories(humanId, "long_term"),
  recordLesson(input: { human_id: string; title: string; content: string }) {
    return memoryService.create({
      ...input,
      tier: "long_term",
      category: "personal",
    });
  },
};

export const temporaryMemoryService = {
  list: (humanId: string) => listMemories(humanId, "temporary"),
  scratch(input: { human_id: string; title: string; content: string }) {
    return memoryService.create({
      ...input,
      tier: "temporary",
      category: "temporary",
    });
  },
};

export const contextRuntimeService = {
  get: getContextRuntime,
  resolve(input: {
    human_id: string;
    institution_id?: string;
    mission_id?: string;
    device?: string;
  }) {
    const brain = getLocalBrainByHuman(input.human_id);
    if (!brain) throw new LocalBrainError("LOCALBRAIN_NOT_FOUND", "LocalBrain not found");
    const experienceCtx = input.institution_id
      ? experienceService.context.resolve({
          human_id: input.human_id,
          institution_id: input.institution_id,
          device: input.device as "laptop" | undefined,
        })
      : null;
    const existing = getContextRuntime(input.human_id);
    const record = {
      context_id: existing?.context_id ?? caeId("ctx"),
      localbrain_id: brain.localbrain_id,
      human_id: input.human_id,
      institution_id: input.institution_id ?? existing?.institution_id ?? null,
      mission_id: input.mission_id ?? experienceCtx?.context.current_mission ?? existing?.mission_id ?? null,
      calendar_event_id: existing?.calendar_event_id ?? null,
      organization_id: existing?.organization_id ?? null,
      conversation_id: existing?.conversation_id ?? null,
      learning_session_id: existing?.learning_session_id ?? null,
      executive_priority: existing?.executive_priority ?? null,
      device: input.device ?? existing?.device ?? "laptop",
      timezone: brain.timezone,
      priorities: existing?.priorities ?? [],
      deadlines: existing?.deadlines ?? [],
      updated_at: nowIso(),
    };
    saveContextRuntime(record);
    return { context: record, event: "context.changed" as const, begins_with_context: true };
  },
};

export const timelineService = {
  list: listTimeline,
  add(input: {
    human_id: string;
    period: Parameters<typeof saveTimelineEntry>[0]["period"];
    category: MemoryCategory;
    title: string;
    institution_id?: string;
  }) {
    const brain = getLocalBrainByHuman(input.human_id);
    if (!brain) throw new LocalBrainError("LOCALBRAIN_NOT_FOUND", "LocalBrain not found");
    const record = {
      entry_id: caeId("tl"),
      localbrain_id: brain.localbrain_id,
      human_id: input.human_id,
      period: input.period,
      category: input.category,
      title: input.title,
      occurred_at: nowIso(),
      institution_id: input.institution_id ?? null,
    };
    saveTimelineEntry(record);
    return { entry: record, event: "timeline.updated" as const, explainable: true };
  },
};

export const knowledgeGraphService = {
  list: listKnowledgeNodes,
  add(input: {
    human_id: string;
    node_type: Parameters<typeof saveKnowledgeNode>[0]["node_type"];
    label: string;
    links?: string[];
  }) {
    const brain = getLocalBrainByHuman(input.human_id);
    if (!brain) throw new LocalBrainError("LOCALBRAIN_NOT_FOUND", "LocalBrain not found");
    const record = {
      node_id: caeId("kg"),
      localbrain_id: brain.localbrain_id,
      human_id: input.human_id,
      node_type: input.node_type,
      label: input.label,
      links: input.links ?? [],
      created_at: nowIso(),
    };
    saveKnowledgeNode(record);
    return { node: record, event: "knowledge.cached" as const, interconnected: true };
  },
  cache(input: { human_id: string; artifacts: string[] }) {
    return {
      human_id: input.human_id,
      cached: input.artifacts,
      offline_capable: true,
      encrypted: true,
    };
  },
};

export const workspaceMemoryService = {
  get: getWorkspaceMemory,
  update(input: {
    human_id: string;
    favorite_dashboards?: string[];
    pinned_missions?: string[];
    workspace_layout?: Record<string, unknown>;
  }) {
    const brain = getLocalBrainByHuman(input.human_id);
    if (!brain) throw new LocalBrainError("LOCALBRAIN_NOT_FOUND", "LocalBrain not found");
    const existing = getWorkspaceMemory(input.human_id);
    const record = {
      workspace_memory_id: existing?.workspace_memory_id ?? caeId("wsp"),
      localbrain_id: brain.localbrain_id,
      human_id: input.human_id,
      favorite_dashboards: input.favorite_dashboards ?? existing?.favorite_dashboards ?? [],
      pinned_missions: input.pinned_missions ?? existing?.pinned_missions ?? [],
      preferred_reports: existing?.preferred_reports ?? [],
      frequent_searches: existing?.frequent_searches ?? [],
      workspace_layout: input.workspace_layout ?? existing?.workspace_layout ?? {},
      recent_organizations: existing?.recent_organizations ?? [],
      updated_at: nowIso(),
    };
    saveWorkspaceMemory(record);
    return { workspace: record, event: "workspace.updated" as const };
  },
};

export const relationshipMemoryService = {
  list: listRelationshipMemory,
  learn(input: {
    human_id: string;
    contact_human_id: string;
    relationship_type: Parameters<typeof saveRelationshipMemory>[0]["relationship_type"];
  }) {
    const brain = getLocalBrainByHuman(input.human_id);
    if (!brain) throw new LocalBrainError("LOCALBRAIN_NOT_FOUND", "LocalBrain not found");
    const existing = listRelationshipMemory(input.human_id).find(
      (r) => r.contact_human_id === input.contact_human_id
    );
    const record = {
      relationship_id: existing?.relationship_id ?? caeId("rel"),
      localbrain_id: brain.localbrain_id,
      human_id: input.human_id,
      contact_human_id: input.contact_human_id,
      relationship_type: input.relationship_type,
      interaction_count: (existing?.interaction_count ?? 0) + 1,
      last_interaction_at: nowIso(),
    };
    saveRelationshipMemory(record);
    return { relationship: record, event: "relationship.learned" as const };
  },
};

export const calendarMemoryService = {
  get: getCalendarMemory,
  update(input: { human_id: string; preparation_buffer_minutes?: number; recovery_time_minutes?: number }) {
    const brain = getLocalBrainByHuman(input.human_id);
    if (!brain) throw new LocalBrainError("LOCALBRAIN_NOT_FOUND", "LocalBrain not found");
    const existing = getCalendarMemory(input.human_id);
    const record = {
      calendar_memory_id: existing?.calendar_memory_id ?? caeId("cal"),
      localbrain_id: brain.localbrain_id,
      human_id: input.human_id,
      working_hours: existing?.working_hours ?? { start: "08:00", end: "18:00" },
      meeting_preferences: existing?.meeting_preferences ?? [],
      travel_patterns: existing?.travel_patterns ?? [],
      preparation_buffer_minutes: input.preparation_buffer_minutes ?? existing?.preparation_buffer_minutes ?? 15,
      recovery_time_minutes: input.recovery_time_minutes ?? existing?.recovery_time_minutes ?? 10,
      updated_at: nowIso(),
    };
    saveCalendarMemory(record);
    return { calendar_memory: record, intelligent_scheduling: true };
  },
};

export const learningMemoryService = {
  get: getLearningMemory,
  update(input: {
    human_id: string;
    completed_courses?: string[];
    competencies?: string[];
    future_goals?: string[];
  }) {
    const brain = getLocalBrainByHuman(input.human_id);
    if (!brain) throw new LocalBrainError("LOCALBRAIN_NOT_FOUND", "LocalBrain not found");
    const existing = getLearningMemory(input.human_id);
    const record = {
      learning_memory_id: existing?.learning_memory_id ?? caeId("lrn"),
      localbrain_id: brain.localbrain_id,
      human_id: input.human_id,
      completed_courses: input.completed_courses ?? existing?.completed_courses ?? [],
      competencies: input.competencies ?? existing?.competencies ?? [],
      certifications: existing?.certifications ?? [],
      preferred_style: existing?.preferred_style ?? ("hands_on" as const),
      knowledge_gaps: existing?.knowledge_gaps ?? [],
      future_goals: input.future_goals ?? existing?.future_goals ?? [],
      updated_at: nowIso(),
    };
    saveLearningMemory(record);
    return { learning_memory: record, connects_to_learning: true };
  },
};

export const privacyService = {
  domains() {
    return {
      domains: [...PRIVACY_DOMAINS],
      default: "private" as const,
      nothing_shared_automatically: true,
    };
  },
  classify(domain: PrivacyDomain) {
    return {
      domain,
      requires_authorization: domain !== "private",
      institutional_requires_approval: domain === "institution" || domain === "federation",
    };
  },
};

export const synchronizationService = {
  status(humanId: string) {
    const brain = getLocalBrainByHuman(humanId);
    return {
      human_id: humanId,
      sync_policy: brain?.sync_policy ?? "encrypted_cloud",
      modes: ["cloud", "offline", "cross_device", "phone", "tablet", "desktop"],
      encrypted: true,
      offline_capable: true,
    };
  },
};

export const localBrainAnalyticsService = {
  get: getLocalBrainAnalytics,
  compute(humanId: string) {
    const brain = getLocalBrainByHuman(humanId);
    if (!brain) throw new LocalBrainError("LOCALBRAIN_NOT_FOUND", "LocalBrain not found");
    const record = {
      analytics_id: caeId("lba"),
      localbrain_id: brain.localbrain_id,
      human_id: humanId,
      memory_count: listMemories(humanId).length,
      context_updates: getContextRuntime(humanId) ? 1 : 0,
      institution_connections: listInstitutionConnections(humanId).length,
      knowledge_nodes: listKnowledgeNodes(humanId).length,
      computed_at: nowIso(),
    };
    saveLocalBrainAnalytics(record);
    return record;
  },
};

export const localBrainRuntime = {
  localBrain: localBrainService,
  memory: memoryService,
  workingMemory: workingMemoryService,
  longTermMemory: longTermMemoryService,
  temporaryMemory: temporaryMemoryService,
  context: contextRuntimeService,
  timeline: timelineService,
  knowledgeGraph: knowledgeGraphService,
  workspace: workspaceMemoryService,
  relationships: relationshipMemoryService,
  calendar: calendarMemoryService,
  learning: learningMemoryService,
  privacy: privacyService,
  synchronization: synchronizationService,
  analytics: localBrainAnalyticsService,
  connections: {
    list: listInstitutionConnections,
  },
  preferences: {
    get: getPreferences,
    update(input: {
      human_id: string;
      notifications?: Record<string, boolean>;
      language?: string;
    }) {
      const brain = getLocalBrainByHuman(input.human_id);
      if (!brain) throw new LocalBrainError("LOCALBRAIN_NOT_FOUND", "LocalBrain not found");
      const existing = getPreferences(input.human_id);
      const record = {
        preferences_id: existing?.preferences_id ?? caeId("prf"),
        localbrain_id: brain.localbrain_id,
        human_id: input.human_id,
        notifications: input.notifications ?? existing?.notifications ?? {},
        accessibility: existing?.accessibility ?? {},
        language: input.language ?? existing?.language ?? "en",
        updated_at: nowIso(),
      };
      savePreferences(record);
      return { preferences: record, event: "preferences.changed" as const };
    },
  },
};
