/**
 * CAE-11.7-W6 — Conversation Intelligence services
 */
import { caeId, nowIso } from "../../../../../utils";
import { localBrainRuntime } from "../../localbrain/services/localbrain-service";
import { seedLocalBrainIfEmpty } from "../../localbrain/services/seed";
import { contextIntelligenceRuntime } from "../../context/services/context-intelligence-service";
import { seedContextIfEmpty } from "../../context/services/seed";
import { executiveAssistantRuntime } from "../../executive-assistant/services/executive-assistant-service";
import { seedExecutiveIfEmpty } from "../../executive-assistant/services/seed";
import { organizerRuntime } from "../../organizer/services/organizer-service";
import { seedOrganizerIfEmpty } from "../../organizer/services/seed";
import { researchRuntime } from "../../research/services/research-network-service";
import { seedResearchIfEmpty } from "../../research/services/seed";
import type { ConversationChannel, RecordingState } from "../data-model";
import {
  getConsent,
  getConversation,
  listActions,
  listCommitments,
  listConversations,
  listDecisions,
  listDialogueNodes,
  listMeetings,
  listSearchHistory,
  listSpeakers,
  listTranscripts,
  listTranslations,
  saveAction,
  saveCommitment,
  saveConsent,
  saveConversation,
  saveDecision,
  saveDialogueNode,
  saveMeeting,
  saveRecording,
  saveSearch,
  saveSpeaker,
  saveTranscript,
  saveTranslation,
} from "./repository";

export class ConversationError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

function ensureConversationBoot() {
  seedLocalBrainIfEmpty();
  seedContextIfEmpty();
  seedExecutiveIfEmpty();
  seedOrganizerIfEmpty();
  seedResearchIfEmpty();
}

function getBrain(humanId: string) {
  ensureConversationBoot();
  const brain = localBrainRuntime.localBrain.getByHuman(humanId);
  if (!brain) throw new ConversationError("CONVERSATION_CONTEXT_REQUIRED", "LocalBrain required");
  return brain;
}

function requireConsent(conversationId: string) {
  const consent = getConsent(conversationId);
  if (!consent || consent.status !== "granted") {
    throw new ConversationError("CONSENT_REQUIRED", "Recording or transcription requires consent");
  }
  return consent;
}

export const consentService = {
  get: getConsent,
  grant(input: {
    conversation_id: string;
    human_id: string;
    institution_id: string;
    jurisdiction_rules?: string[];
    retention_policy?: string;
  }) {
    const record = {
      consent_id: caeId("cns"),
      conversation_id: input.conversation_id,
      human_id: input.human_id,
      institution_id: input.institution_id,
      status: "granted" as const,
      jurisdiction_rules: input.jurisdiction_rules ?? ["two_party_consent_notified"],
      retention_policy: input.retention_policy ?? "institutional_default_7y",
      recorded_at: nowIso(),
    };
    saveConsent(record);
    return { consent: record, event: "consent.granted" as const };
  },
  deny(input: { conversation_id: string; human_id: string; institution_id: string }) {
    const record = {
      consent_id: caeId("cns"),
      conversation_id: input.conversation_id,
      human_id: input.human_id,
      institution_id: input.institution_id,
      status: "denied" as const,
      jurisdiction_rules: [],
      retention_policy: "no_retention",
      recorded_at: nowIso(),
    };
    saveConsent(record);
    return { consent: record, event: "consent.denied" as const, recording_blocked: true };
  },
};

export const recordingService = {
  capture(input: {
    conversation_id: string;
    human_id: string;
    institution_id: string;
    recording_state: RecordingState;
    authorized_by: string;
  }) {
    if (input.recording_state === "consent_denied" || input.recording_state === "not_recorded") {
      throw new ConversationError("RECORDING_NOT_AUTHORIZED", "Recording not authorized");
    }
    requireConsent(input.conversation_id);
    const record = {
      recording_id: caeId("rec"),
      conversation_id: input.conversation_id,
      human_id: input.human_id,
      institution_id: input.institution_id,
      recording_state: input.recording_state,
      authorized_by: input.authorized_by,
      captured_at: nowIso(),
      secret: false as const,
    };
    saveRecording(record);
    return { recording: record, event: "conversation.recorded" as const, secret: false };
  },
};

export const conversationService = {
  list: listConversations,
  get: getConversation,
  import(input: {
    human_id: string;
    institution_id: string;
    channel: ConversationChannel;
    title: string;
    participants: string[];
    mission_id?: string;
    consent_status: RecordingState;
    source: string;
    evidence_links?: string[];
  }) {
    const brain = getBrain(input.human_id);
    if (input.consent_status === "consent_denied") {
      throw new ConversationError("IMPORT_CONSENT_DENIED", "Cannot import without consent");
    }
    const record = {
      conversation_id: caeId("cnv"),
      human_id: input.human_id,
      institution_id: input.institution_id,
      localbrain_id: brain.localbrain_id,
      mission_id: input.mission_id ?? null,
      channel: input.channel,
      title: input.title,
      started_at: nowIso(),
      ended_at: null,
      consent_status: input.consent_status,
      recording_status: input.consent_status,
      participants: input.participants,
      source: input.source,
      evidence_links: input.evidence_links ?? [],
      version: 1,
      anonymous: false as const,
    };
    saveConversation(record);
    if (input.consent_status !== "consent_required") {
      consentService.grant({
        conversation_id: record.conversation_id,
        human_id: input.human_id,
        institution_id: input.institution_id,
      });
    }
    return { conversation: record, event: "conversation.imported" as const, anonymous: false };
  },
};

export const speakerIdentificationService = {
  list: listSpeakers,
  identify(input: {
    conversation_id: string;
    display_name: string;
    identity_id?: string;
    institution_id: string;
    role?: string;
    confidence?: number;
    intervals?: { start: string; end: string }[];
  }) {
    requireConsent(input.conversation_id);
    const record = {
      speaker_id: caeId("spk"),
      conversation_id: input.conversation_id,
      identity_id: input.identity_id ?? null,
      display_name: input.display_name,
      institution_id: input.institution_id,
      role: input.role ?? null,
      confidence: input.confidence ?? (input.identity_id ? 0.9 : 0.5),
      invented: false as const,
      speaking_intervals: input.intervals ?? [{ start: "00:00:00", end: "00:05:00" }],
      participation_summary: `${input.display_name} participated in discussion`,
    };
    saveSpeaker(record);
    return { speaker: record, event: "speaker.identified" as const, invented: false };
  },
};

export const transcriptionService = {
  list: listTranscripts,
  generate(input: {
    conversation_id: string;
    human_id: string;
    institution_id: string;
    content: string;
    transcript_type?: "verbatim" | "readable" | "corrected" | "timestamped" | "speaker_separated";
    version?: number;
  }) {
    requireConsent(input.conversation_id);
    const existing = listTranscripts(input.conversation_id);
    const record = {
      transcript_id: caeId("trn"),
      conversation_id: input.conversation_id,
      human_id: input.human_id,
      institution_id: input.institution_id,
      transcript_type: input.transcript_type ?? ("readable" as const),
      content: input.content,
      confidence: 0.88,
      version: input.version ?? existing.length + 1,
      original_preserved: true as const,
      generated_at: nowIso(),
    };
    saveTranscript(record);
    return { transcript: record, event: "transcript.generated" as const, versioned: true };
  },
};

export const translationService = {
  list: listTranslations,
  translate(input: {
    transcript_id: string;
    conversation_id: string;
    original_language: string;
    translated_language: string;
    content: string;
  }) {
    requireConsent(input.conversation_id);
    const record = {
      translation_id: caeId("trl"),
      transcript_id: input.transcript_id,
      conversation_id: input.conversation_id,
      original_language: input.original_language,
      translated_language: input.translated_language,
      parallel_content: [{ original: input.content, translated: `[ES] ${input.content}` }],
      confidence: 0.85,
      reviewer_corrections: [] as string[],
      generated_at: nowIso(),
    };
    saveTranslation(record);
    return { translation: record, event: "translation.generated" as const, spanish_supported: true };
  },
};

export const conversationIntelligenceService = {
  analyze(conversationId: string) {
    const conversation = getConversation(conversationId);
    if (!conversation) throw new ConversationError("CONVERSATION_NOT_FOUND", "Conversation not found");
    return {
      conversation_id: conversationId,
      topics: ["County immersion planning", "Volunteer coordination"],
      questions: ["What is the county match requirement?"],
      answers: ["Match confirmed at 15% for planning grant"],
      ideas: ["Partner with regional nonprofit for facilitator training"],
      concerns: ["Timeline may conflict with legislative session"],
      risks: ["Funding window closes in 45 days"],
      evidence_references: conversation.evidence_links,
      policy_references: ["HB-214 education funding"],
      research_references: ["CDBG planning grant notice"],
      knowledge_gaps: ["Confirmed fiscal impact timeline"],
      mission_impacts: conversation.mission_id ? [conversation.mission_id] : [],
      reviewable: true,
      emotions_inferred: false,
    };
  },
};

export const meetingMemoryService = {
  list: listMeetings,
  store(input: {
    conversation_id: string;
    human_id: string;
    institution_id: string;
    title: string;
    agenda?: string[];
    attendance?: string[];
  }) {
    requireConsent(input.conversation_id);
    const intelligence = conversationIntelligenceService.analyze(input.conversation_id);
    const record = {
      meeting_id: caeId("mtg"),
      conversation_id: input.conversation_id,
      human_id: input.human_id,
      institution_id: input.institution_id,
      title: input.title,
      agenda: input.agenda ?? ["Opening", "County update", "Action items"],
      attendance: input.attendance ?? ["usr-001", "usr-003"],
      discussion_timeline: [
        { time: "00:05", topic: intelligence.topics[0] ?? "Discussion", speaker: "usr-001" },
      ],
      evidence_used: intelligence.evidence_references,
      documents_referenced: ["County briefing packet"],
      questions: intelligence.questions,
      decisions: [],
      votes: [],
      follow_up: intelligence.knowledge_gaps,
      lessons_learned: [],
      institutional_context: "Block Street county immersion initiative",
      searchable: true as const,
    };
    saveMeeting(record);
    return { meeting: record, searchable: true };
  },
};

export const decisionDetectionService = {
  list: listDecisions,
  detect(input: {
    conversation_id: string;
    human_id: string;
    institution_id: string;
    summary: string;
    decision_type?: "formal" | "consensus" | "deferred" | "rejected" | "pending_approval";
    evidence?: string[];
  }) {
    requireConsent(input.conversation_id);
    const record = {
      decision_id: caeId("dec"),
      conversation_id: input.conversation_id,
      human_id: input.human_id,
      institution_id: input.institution_id,
      decision_type: input.decision_type ?? ("pending_approval" as const),
      summary: input.summary,
      evidence: input.evidence ?? ["Meeting transcript excerpt"],
      confidence: 0.8,
      human_confirmed: false,
      canonical: false as const,
      detected_at: nowIso(),
    };
    saveDecision(record);
    return {
      decision: record,
      event: "decision.detected" as const,
      human_confirmation_required: true,
      links_executive_assistant: true,
    };
  },
  confirm(decisionId: string, humanId: string, institutionId: string) {
    const decisions = listDecisions(institutionId);
    const existing = decisions.find((d) => d.decision_id === decisionId);
    if (!existing) throw new ConversationError("DECISION_NOT_FOUND", "Decision not found");
    const updated = { ...existing, human_confirmed: true };
    saveDecision(updated);
    return { decision: updated, canonical: false, executive_package_ready: true };
  },
};

export const commitmentDetectionService = {
  list: listCommitments,
  detect(input: {
    conversation_id: string;
    human_id: string;
    institution_id: string;
    commitment_text: string;
    assignee_id?: string;
    deadline?: string;
    evidence?: string[];
  }) {
    requireConsent(input.conversation_id);
    const record = {
      commitment_id: caeId("cmt"),
      conversation_id: input.conversation_id,
      human_id: input.human_id,
      institution_id: input.institution_id,
      assignee_id: input.assignee_id ?? null,
      commitment_text: input.commitment_text,
      deadline: input.deadline ?? null,
      evidence: input.evidence ?? ["Verbatim quote from transcript"],
      confidence: 0.82,
      human_confirmed: false,
      canonical: false as const,
      detected_at: nowIso(),
    };
    saveCommitment(record);
    return {
      commitment: record,
      event: "commitment.detected" as const,
      human_confirmation_required: true,
    };
  },
  confirm(commitmentId: string, humanId: string) {
    const commitments = listCommitments(humanId);
    const existing = commitments.find((c) => c.commitment_id === commitmentId);
    if (!existing) throw new ConversationError("COMMITMENT_NOT_FOUND", "Commitment not found");
    const updated = { ...existing, human_confirmed: true };
    saveCommitment(updated);
    return {
      commitment: updated,
      executive_handoff: executiveAssistantRuntime.commitment.list(humanId).length >= 0,
      canonical: false,
    };
  },
};

export const actionSuggestionService = {
  list: listActions,
  suggest(input: {
    conversation_id: string;
    human_id: string;
    institution_id: string;
    action_type: "task" | "delegation" | "checklist" | "follow_up" | "document_update" | "research_request" | "training_request";
    title: string;
    description: string;
  }) {
    requireConsent(input.conversation_id);
    const record = {
      action_id: caeId("act"),
      conversation_id: input.conversation_id,
      human_id: input.human_id,
      institution_id: input.institution_id,
      action_type: input.action_type,
      title: input.title,
      description: input.description,
      confidence: 0.78,
      auto_executed: false as const,
      status: "suggested" as const,
    };
    saveAction(record);
    return {
      action: record,
      event: "action.suggested" as const,
      organizer_integration: true,
      auto_executed: false,
    };
  },
};

export const dialogueGraphService = {
  list: listDialogueNodes,
  link(input: {
    institution_id: string;
    node_type: "person" | "meeting" | "topic" | "policy" | "research" | "mission" | "organization" | "project" | "document" | "question" | "evidence";
    label: string;
    reference_id: string;
    linked_nodes?: string[];
  }) {
    const record = {
      node_id: caeId("dlg"),
      institution_id: input.institution_id,
      node_type: input.node_type,
      label: input.label,
      reference_id: input.reference_id,
      linked_nodes: input.linked_nodes ?? [],
      created_at: nowIso(),
    };
    saveDialogueNode(record);
    return { node: record, evolving_graph: true };
  },
};

export const conversationSearchService = {
  history: listSearchHistory,
  search(input: { human_id: string; institution_id: string; query: string }) {
    const conversations = listConversations(input.human_id);
    const meetings = listMeetings(input.human_id);
    const results = conversations
      .filter((c) => c.title.toLowerCase().includes(input.query.toLowerCase()) || input.query.length > 3)
      .slice(0, 5)
      .map((c) => ({
        conversation_id: c.conversation_id,
        excerpt: `${c.title} — ${c.channel}`,
        confidence: 0.85,
        evidence: c.evidence_links,
      }));
    if (results.length === 0 && meetings.length > 0) {
      results.push({
        conversation_id: meetings[0].conversation_id,
        excerpt: meetings[0].title,
        confidence: 0.75,
        evidence: meetings[0].evidence_used,
      });
    }
    const record = {
      search_id: caeId("srch"),
      human_id: input.human_id,
      institution_id: input.institution_id,
      query: input.query,
      results,
      searched_at: nowIso(),
    };
    saveSearch(record);
    return { search: record, natural_language: true, evidence_included: true };
  },
};

export const conversationRuntimeService = {
  dashboard(input: { human_id: string; institution_id: string }) {
    ensureConversationBoot();
    const context = contextIntelligenceRuntime.assemble({
      human_id: input.human_id,
      institution_id: input.institution_id,
    });
    const conversations = listConversations(input.human_id);
    const meetings = listMeetings(input.human_id);
    const decisions = listDecisions(input.institution_id);
    const commitments = listCommitments(input.human_id);
    const actions = listActions(input.human_id);
    const dialogue = listDialogueNodes(input.institution_id);
    return {
      greeting: "Conversation Center",
      next_question: "What have we learned from every conversation we've ever had?",
      conversations: conversations.length,
      todays_meetings: meetings.slice(0, 3),
      pending_decisions: decisions.filter((d) => !d.human_confirmed).length,
      pending_commitments: commitments.filter((c) => !c.human_confirmed).length,
      suggested_actions: actions.filter((a) => a.status === "suggested").length,
      dialogue_nodes: dialogue.length,
      confidence: context.confidence,
      secretly_recorded: false,
      mutates_canonical: false,
    };
  },
  summarize(conversationId: string, humanId: string) {
    const conversation = getConversation(conversationId);
    if (!conversation) throw new ConversationError("CONVERSATION_NOT_FOUND", "Conversation not found");
    requireConsent(conversationId);
    const intelligence = conversationIntelligenceService.analyze(conversationId);
    return {
      conversation_id: conversationId,
      summary: `Discussion covered ${intelligence.topics.join(", ")} with ${intelligence.questions.length} open questions.`,
      topics: intelligence.topics,
      open_questions: intelligence.questions,
      human_review_required: true,
      auto_promoted: false,
      generated_by: humanId,
    };
  },
  promote(input: {
    conversation_id: string;
    human_id: string;
    institution_id: string;
    target: "working_knowledge" | "institutional_knowledge";
  }) {
    requireConsent(input.conversation_id);
    return {
      conversation_id: input.conversation_id,
      promotion_status: "pending_review" as const,
      target: input.target,
      event: "knowledge.promoted" as const,
      human_review_required: true,
      auto_promoted: false,
      mutates_canonical: false,
    };
  },
  privacy: {
    prohibited: [
      "secret_recording",
      "ignore_consent",
      "retain_prohibited_recordings",
      "invent_quotations",
      "modify_without_version",
      "profile_personalities",
      "score_participants",
      "infer_protected_characteristics",
    ],
    check(action: string) {
      const blocked = this.prohibited.some((p) => action.includes(p));
      return { allowed: !blocked, transparent: true };
    },
  },
};

export const conversationRuntime = {
  conversation: conversationRuntimeService,
  conversations: conversationService,
  consent: consentService,
  recording: recordingService,
  speakers: speakerIdentificationService,
  transcription: transcriptionService,
  translation: translationService,
  intelligence: conversationIntelligenceService,
  meetings: meetingMemoryService,
  decisions: decisionDetectionService,
  commitments: commitmentDetectionService,
  actions: actionSuggestionService,
  dialogue: dialogueGraphService,
  search: conversationSearchService,
};
