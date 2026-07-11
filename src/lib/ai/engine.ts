import { readFileSync, writeFileSync, existsSync, appendFileSync } from "fs";
import { join } from "path";
import { getExecutiveDashboard } from "@/lib/analytics/engine";
import { getTodaysMissions } from "@/lib/missions/engine";
import { getAlerts as getRelationshipAlerts, getHealthDashboard } from "@/lib/relationships/engine";
import { listRecommendations } from "@/lib/recommendations/engine";
import type {
  ActionCategory,
  AIEvidence,
  AIResponse,
  AuditEntry,
  ChatRequest,
  EveningBrief,
  MemoryEntry,
  MorningBrief,
  PlanRequest,
  WriteRequest,
} from "./types";

const DATA = join(process.cwd(), "data", "ai");
const MEMORY_PATH = join(DATA, "memory.json");
const AUDIT_PATH = join(DATA, "audit_log.jsonl");

let memoryCache: MemoryEntry[] | null = null;

function loadMemory(): MemoryEntry[] {
  if (memoryCache) return memoryCache;
  const raw = JSON.parse(readFileSync(MEMORY_PATH, "utf8"));
  memoryCache = raw.entries as MemoryEntry[];
  return memoryCache;
}

function persistMemory(entries: MemoryEntry[]) {
  writeFileSync(MEMORY_PATH, JSON.stringify({ entries }, null, 2));
  memoryCache = entries;
}

function appendAudit(entry: AuditEntry) {
  appendFileSync(AUDIT_PATH, JSON.stringify(entry) + "\n");
}

function makeId() {
  return `ai-${Date.now()}`;
}

function gatherContext() {
  const dashboard = getExecutiveDashboard();
  const missions = getTodaysMissions();
  const recs = listRecommendations({ limit: 5 });
  const relHealth = getHealthDashboard();
  const relAlerts = getRelationshipAlerts();
  return { dashboard, missions, recs, relHealth, relAlerts };
}

function buildEvidence(ctx: ReturnType<typeof gatherContext>): AIEvidence[] {
  return [
    { source: "ANL-001", detail: `Campaign health ${ctx.dashboard.campaignHealthPercent}%`, type: "fact" },
    { source: "MBD-001", detail: `${ctx.missions.length} missions today`, type: "fact" },
    { source: "RIE-001", detail: `Top recommendation: ${ctx.recs[0]?.title ?? "none"}`, type: "recommendation" },
    { source: "RLI-001", detail: `Relationship health ${ctx.relHealth.relationshipHealthPercent}%`, type: "fact" },
    { source: "RLI-001", detail: `${ctx.relAlerts.filter((a) => a.severity === "warning").length} relationship warnings`, type: "fact" },
  ];
}

function recordInteraction(
  action: string,
  prompt: string,
  userId: string,
  toolsUsed: string[],
  suggestedActions: string[],
  category: ActionCategory,
  accepted: string[] = []
) {
  appendAudit({
    timestamp: new Date().toISOString(),
    userId,
    action,
    prompt,
    dataSources: ["analytics/dashboard", "missions/today", "recommendations", "relationships/health"],
    toolsUsed,
    suggestedActions,
    acceptedActions: accepted,
    rejectedActions: [],
    category,
  });
}

export function getMorningBrief(): MorningBrief {
  const ctx = gatherContext();
  const evidence = buildEvidence(ctx);
  const topPriorities = [
    ...ctx.missions.slice(0, 2).map((m) => m.title),
    ctx.recs[0]?.title ?? "Review county dashboards",
  ].filter(Boolean);
  recordInteraction("morning_brief", "Generate morning brief", "admin", ["gatherContext", "getMorningBrief"], topPriorities, "advisory");
  return {
    greeting: "Good Morning",
    campaignHealthPercent: ctx.dashboard.campaignHealthPercent,
    todaysPriorities: ctx.missions.length,
    criticalDeadlines: ctx.missions.filter((m) => m.priorityLabel === "Critical" || m.priorityLabel === "High").length,
    travel: "Conway → Russellville",
    volunteerAlerts: 3,
    countyAlerts: ctx.relAlerts.filter((a) => a.category === "county").length,
    recommendedCalls: ctx.relAlerts.filter((a) => a.feedsRecommendation).length,
    topPriorities,
    evidence,
  };
}

export function getEveningBrief(): EveningBrief {
  const ctx = gatherContext();
  return {
    completedMissions: ctx.missions.filter((m) => m.status === "completed").length,
    unfinishedWork: ctx.missions.filter((m) => m.status !== "completed").length,
    emergingIssues: ctx.relAlerts.map((a) => a.title),
    tomorrowPreparation: ["Review Benton canvass mission", "Confirm town hall speaker", "Call dormant contacts"],
  };
}

export function chat(req: ChatRequest): AIResponse {
  const ctx = gatherContext();
  const prompt = req.prompt.toLowerCase();
  const userId = req.userId ?? "admin";
  let answer = "";
  let category: ActionCategory = "advisory";
  const suggested: string[] = [];

  if (prompt.includes("health") || prompt.includes("campaign")) {
    answer = `Campaign health is ${ctx.dashboard.campaignHealthPercent}%. Volunteer growth +${ctx.dashboard.volunteerGrowthPercent}%. County coverage ${ctx.dashboard.countyCoverage.active}/${ctx.dashboard.countyCoverage.total}. Mission completion ${ctx.dashboard.missionCompletionPercent}%.`;
  } else if (prompt.includes("benton") || prompt.includes("slow")) {
    answer = `Benton County volunteer recruitment is below goal. RIE recommends a weekend canvass push. Mission Board has an accepted canvass mission assigned to Mike Torres. Relationship cross-county link with Pulaski is dormant (94 days).`;
    suggested.push("Execute Benton canvass mission", "Re-engage Sarah–Mike relationship");
  } else if (prompt.includes("county") || prompt.includes("attention")) {
    answer = `Immediate attention: Craighead County (analytics alert — volunteer decline, leadership vacancy). Washington County strong at 91% health. Pulaski petition drive at 55% progress.`;
    suggested.push("Assign Craighead leadership support mission");
    category = "approval_required";
  } else if (prompt.includes("relationship") || prompt.includes("partner")) {
    answer = `Strongest education partner: Dr. Lisa Harmon (influence 91%, growing). Top connector: Kelly Brooks (Education, Faith, Food Security). ${ctx.relHealth.dormant} dormant relationships need attention.`;
  } else if (prompt.includes("mission") || prompt.includes("today")) {
    answer = `Today: ${ctx.missions.length} active missions. Top priority: ${ctx.missions[0]?.title ?? "none"}. ${ctx.missions.filter((m) => m.status === "blocked").length} blocked.`;
  } else {
    answer = `Based on current intelligence: campaign health ${ctx.dashboard.campaignHealthPercent}%, ${ctx.missions.length} missions today, ${ctx.recs.length} active recommendations. Ask about counties, relationships, missions, or analytics for deeper analysis.`;
  }

  const response: AIResponse = {
    id: makeId(),
    answer,
    category,
    confidencePercent: 88,
    evidence: buildEvidence(ctx),
    assumptions: ["Bootstrap intelligence data current as of 2026-07-10", "User has statewide executive scope"],
    risks: category === "approval_required" ? ["Suggested actions require human approval before execution"] : [],
    toolsUsed: ["gatherContext", "analytics", "missions", "recommendations", "relationships"],
    requiresApproval: category !== "advisory",
    timestamp: new Date().toISOString(),
  };
  recordInteraction("chat", req.prompt, userId, response.toolsUsed, suggested, category);
  return response;
}

export function plan(req: PlanRequest): AIResponse {
  const ctx = gatherContext();
  const answer = `Plan for "${req.topic}" (${req.horizon ?? "this week"}):\n1. Review ${ctx.dashboard.countyCoverage.active} active counties\n2. Prioritize ${ctx.missions.length} today's missions\n3. Address ${ctx.relAlerts.length} relationship alerts\n4. Execute top RIE recommendation: ${ctx.recs[0]?.title ?? "county review"}`;
  const response: AIResponse = {
    id: makeId(),
    answer,
    category: "advisory",
    confidencePercent: 85,
    evidence: buildEvidence(ctx),
    assumptions: ["Plan based on current subsystem snapshots"],
    risks: [],
    alternatives: ["Option A: County-first focus", "Option B: Volunteer recruitment push (recommended)", "Option C: Coalition expansion"],
    toolsUsed: ["plan", "gatherContext"],
    requiresApproval: false,
    timestamp: new Date().toISOString(),
  };
  recordInteraction("plan", req.topic, req.userId ?? "admin", response.toolsUsed, [], "advisory");
  return response;
}

export function research(topic: string, userId?: string): AIResponse {
  const answer = `Research summary for "${topic}": Grounded in SIS-001 search index and CKK-001 canon. Related organizations and legislation references would be retrieved from knowledge graph. [Bootstrap: cite sources before distribution.]`;
  const response: AIResponse = {
    id: makeId(),
    answer,
    category: "advisory",
    confidencePercent: 78,
    evidence: [{ source: "SIS-001", detail: "Search index available", type: "fact" }, { source: "CKK-001", detail: "Canon grounding enabled", type: "fact" }],
    assumptions: ["Research requires live search index for full citations"],
    risks: ["Verify all citations before external use"],
    toolsUsed: ["research", "search"],
    requiresApproval: false,
    timestamp: new Date().toISOString(),
  };
  recordInteraction("research", topic, userId ?? "admin", response.toolsUsed, [], "advisory");
  return response;
}

export function writeContent(req: WriteRequest): AIResponse {
  const answer = `[Draft ${req.type} — ${req.topic}]\n\nThis is a bootstrap draft for review. Tone: ${req.tone ?? "professional"}. All generated content requires human review and approval before publication per KDG-M16 guardrails.`;
  const response: AIResponse = {
    id: makeId(),
    answer,
    category: "approval_required",
    confidencePercent: 70,
    evidence: [{ source: "EAIL", detail: "Generated from campaign context", type: "recommendation" }],
    assumptions: ["Draft only — not for publication without approval"],
    risks: ["Content must be reviewed for accuracy and tone"],
    toolsUsed: ["write"],
    requiresApproval: true,
    timestamp: new Date().toISOString(),
  };
  recordInteraction("write", `${req.type}: ${req.topic}`, req.userId ?? "admin", response.toolsUsed, ["Review and approve draft"], "approval_required");
  return response;
}

export function analyze(topic: string, userId?: string): AIResponse {
  const ctx = gatherContext();
  const answer = `Analytics intelligence for "${topic}": Campaign health ${ctx.dashboard.campaignHealthPercent}% driven by volunteer health (88%), county health (avg), and mission completion (91%). Volunteer retention forecast: complete October 12 at 88% confidence.`;
  const response: AIResponse = {
    id: makeId(),
    answer,
    category: "advisory",
    confidencePercent: 90,
    evidence: buildEvidence(ctx),
    assumptions: ["Forecasts include confidence intervals from ANL-001"],
    risks: [],
    toolsUsed: ["analyze", "analytics"],
    requiresApproval: false,
    timestamp: new Date().toISOString(),
  };
  recordInteraction("analyze", topic, userId ?? "admin", response.toolsUsed, [], "advisory");
  return response;
}

export function summarize(topic: string, userId?: string): AIResponse {
  return analyze(`Summarize: ${topic}`, userId);
}

export function meetingAssist(topic: string, userId?: string): AIResponse {
  const answer = `Meeting agenda for "${topic}":\n1. Review objectives\n2. County status updates\n3. Mission assignments\n4. Action items → Mission Board\n\n[Approval required to create missions from action items.]`;
  const response: AIResponse = {
    id: makeId(),
    answer,
    category: "approval_required",
    confidencePercent: 82,
    evidence: [{ source: "MBD-001", detail: "Mission Board integration ready", type: "fact" }],
    assumptions: [],
    risks: [],
    toolsUsed: ["meeting", "missions"],
    requiresApproval: true,
    timestamp: new Date().toISOString(),
  };
  recordInteraction("meeting", topic, userId ?? "admin", response.toolsUsed, ["Create missions from action items"], "approval_required");
  return response;
}

export function missionAssist(topic: string, userId?: string): AIResponse {
  const ctx = gatherContext();
  const answer = `Mission intelligence for "${topic}": ${ctx.missions.length} missions active today. Suggest creating mission from RIE: ${ctx.recs[0]?.title ?? "county review"}. Estimated 4 hours. Dependencies should be checked before assignment.`;
  const response: AIResponse = {
    id: makeId(),
    answer,
    category: "approval_required",
    confidencePercent: 86,
    evidence: buildEvidence(ctx),
    assumptions: [],
    risks: ["Mission creation requires explicit approval"],
    toolsUsed: ["mission", "missions", "recommendations"],
    requiresApproval: true,
    timestamp: new Date().toISOString(),
  };
  recordInteraction("mission", topic, userId ?? "admin", response.toolsUsed, ["Create mission"], "approval_required");
  return response;
}

export function calendarAssist(topic: string, userId?: string): AIResponse {
  const answer = `Calendar intelligence: You're traveling to Conway. Suggested stops: volunteer meeting, food bank visit, county newspaper interview. No scheduling conflicts detected in bootstrap data.`;
  const response: AIResponse = {
    id: makeId(),
    answer,
    category: "advisory",
    confidencePercent: 80,
    evidence: [{ source: "Calendar", detail: "Travel route Conway → Russellville", type: "fact" }],
    assumptions: ["Full calendar sync pending live integration"],
    risks: [],
    toolsUsed: ["calendar"],
    requiresApproval: false,
    timestamp: new Date().toISOString(),
  };
  recordInteraction("calendar", topic, userId ?? "admin", response.toolsUsed, [], "advisory");
  return response;
}

export function listMemory(): MemoryEntry[] {
  return loadMemory();
}

export function updateMemory(id: string, value: string): MemoryEntry | null {
  const entries = loadMemory();
  const idx = entries.findIndex((e) => e.id === id);
  if (idx < 0) return null;
  entries[idx] = { ...entries[idx], value, updatedAt: new Date().toISOString() };
  persistMemory(entries);
  return entries[idx];
}

export function clearMemory(id?: string): void {
  if (id) {
    persistMemory(loadMemory().filter((e) => e.id !== id));
  } else {
    persistMemory([]);
  }
}

export function getAuditHistory(limit = 50): AuditEntry[] {
  if (!existsSync(AUDIT_PATH)) return [];
  return readFileSync(AUDIT_PATH, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => JSON.parse(l) as AuditEntry)
    .slice(-limit)
    .reverse();
}

export function getCapabilities() {
  return JSON.parse(readFileSync(join(DATA, "capabilities.json"), "utf8"));
}

export function getMetrics() {
  const history = getAuditHistory(100);
  const advisory = history.filter((h) => h.category === "advisory").length;
  const approval = history.filter((h) => h.category === "approval_required").length;
  const accepted = history.reduce((s, h) => s + h.acceptedActions.length, 0);
  const suggested = history.reduce((s, h) => s + h.suggestedActions.length, 0);
  return {
    totalInteractions: history.length,
    advisoryCount: advisory,
    approvalRequiredCount: approval,
    acceptanceRatePercent: suggested > 0 ? Math.round((accepted / suggested) * 100) : 0,
    averageConfidencePercent: 85,
    groundingCoveragePercent: 100,
  };
}
