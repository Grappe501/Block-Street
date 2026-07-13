/**
 * CAE-11.7-W3 — Communication persistence (reuses civic-action store)
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

export { readStoreSlice, writeStoreSlice } from "../../11.1/services/repository";
import { readStoreSlice, writeStoreSlice } from "../../11.1/services/repository";
import type {
  ActionItemRecord,
  AISummaryRecord,
  AnnouncementRecord,
  CommunicationHistoryEvent,
  CommunicationVersionRecord,
  ConversationRecord,
  DecisionRecord,
  DocumentRecord,
  KnowledgeRecord,
  MeetingRecord,
  MessageRecord,
  ThreadRecord,
} from "../data-model";
import { COMMUNICATION_STORE_KEYS } from "../data-model";

export const COMMUNICATION_OUTBOX_KEY = "communication_event_outbox";
export const COMMUNICATION_DOMAIN_EVENTS_KEY = "communication_domain_events";
export const COMMUNICATION_IDEMPOTENCY_KEY = "communication_idempotency";
export const COMMUNICATION_AUDIT_KEY = "communication_audit_entries";

const DATA_DIR = join(process.cwd(), "data", "civic-action");
const STORE_PATH = join(DATA_DIR, "store.json");

function readRootStore(): Record<string, unknown> {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(STORE_PATH)) writeFileSync(STORE_PATH, JSON.stringify({}, null, 2));
  return JSON.parse(readFileSync(STORE_PATH, "utf8"));
}

function writeRootStore(store: Record<string, unknown>) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

export function getCommunicationIdempotencyResult(key: string): unknown | null {
  const map = (readRootStore()[COMMUNICATION_IDEMPOTENCY_KEY] as Record<string, unknown>) ?? {};
  const entry = map[key] as { result: unknown; payload_hash: string } | undefined;
  return entry?.result ?? null;
}

export function setCommunicationIdempotencyResult(key: string, result: unknown, payloadHash: string): boolean {
  const store = readRootStore();
  const map = (store[COMMUNICATION_IDEMPOTENCY_KEY] as Record<string, { result: unknown; payload_hash: string }>) ?? {};
  if (map[key] && map[key].payload_hash !== payloadHash) return false;
  map[key] = { result, payload_hash: payloadHash };
  store[COMMUNICATION_IDEMPOTENCY_KEY] = map;
  writeRootStore(store);
  return true;
}

function upsertById<T extends { canonical_id: string }>(key: string, record: T) {
  const items = readStoreSlice<T>(key);
  const idx = items.findIndex((i) => i.canonical_id === record.canonical_id);
  if (idx >= 0) items[idx] = record;
  else items.push(record);
  writeStoreSlice(key, items);
}

export function saveConversation(record: ConversationRecord) {
  upsertById(COMMUNICATION_STORE_KEYS.conversations, record);
}

export function saveThread(record: ThreadRecord) {
  upsertById(COMMUNICATION_STORE_KEYS.threads, record);
}

export function saveMessage(record: MessageRecord) {
  upsertById(COMMUNICATION_STORE_KEYS.messages, record);
}

export function saveDecision(record: DecisionRecord) {
  upsertById(COMMUNICATION_STORE_KEYS.decisions, record);
}

export function saveMeeting(record: MeetingRecord) {
  upsertById(COMMUNICATION_STORE_KEYS.meetings, record);
}

export function saveDocument(record: DocumentRecord) {
  upsertById(COMMUNICATION_STORE_KEYS.documents, record);
}

export function saveActionItem(record: ActionItemRecord) {
  upsertById(COMMUNICATION_STORE_KEYS.action_items, record);
}

export function saveKnowledge(record: KnowledgeRecord) {
  upsertById(COMMUNICATION_STORE_KEYS.knowledge, record);
}

export function saveAISummary(record: AISummaryRecord) {
  upsertById(COMMUNICATION_STORE_KEYS.ai_summaries, record);
}

export function saveAnnouncement(record: AnnouncementRecord) {
  upsertById(COMMUNICATION_STORE_KEYS.announcements, record);
}

export function loadConversation(id: string): ConversationRecord | null {
  return readStoreSlice<ConversationRecord>(COMMUNICATION_STORE_KEYS.conversations).find((c) => c.canonical_id === id) ?? null;
}

export function loadThread(id: string): ThreadRecord | null {
  return readStoreSlice<ThreadRecord>(COMMUNICATION_STORE_KEYS.threads).find((t) => t.canonical_id === id) ?? null;
}

export function loadMessage(id: string): MessageRecord | null {
  return readStoreSlice<MessageRecord>(COMMUNICATION_STORE_KEYS.messages).find((m) => m.canonical_id === id) ?? null;
}

export function loadDecision(id: string): DecisionRecord | null {
  return readStoreSlice<DecisionRecord>(COMMUNICATION_STORE_KEYS.decisions).find((d) => d.canonical_id === id) ?? null;
}

export function loadMeeting(id: string): MeetingRecord | null {
  return readStoreSlice<MeetingRecord>(COMMUNICATION_STORE_KEYS.meetings).find((m) => m.canonical_id === id) ?? null;
}

export function loadDocument(id: string): DocumentRecord | null {
  return readStoreSlice<DocumentRecord>(COMMUNICATION_STORE_KEYS.documents).find((d) => d.canonical_id === id) ?? null;
}

export function loadActionItem(id: string): ActionItemRecord | null {
  return readStoreSlice<ActionItemRecord>(COMMUNICATION_STORE_KEYS.action_items).find((a) => a.canonical_id === id) ?? null;
}

export function listThreadsForConversation(conversationId: string): ThreadRecord[] {
  return readStoreSlice<ThreadRecord>(COMMUNICATION_STORE_KEYS.threads).filter((t) => t.conversation_id === conversationId);
}

export function listMessagesForThread(threadId: string): MessageRecord[] {
  return readStoreSlice<MessageRecord>(COMMUNICATION_STORE_KEYS.messages).filter((m) => m.thread_id === threadId);
}

export function appendCommunicationHistory(event: CommunicationHistoryEvent) {
  const items = readStoreSlice<CommunicationHistoryEvent>(COMMUNICATION_STORE_KEYS.history);
  items.push(event);
  writeStoreSlice(COMMUNICATION_STORE_KEYS.history, items);
}

export function appendCommunicationVersion(version: CommunicationVersionRecord) {
  const items = readStoreSlice<CommunicationVersionRecord>(COMMUNICATION_STORE_KEYS.versions);
  items.push(version);
  writeStoreSlice(COMMUNICATION_STORE_KEYS.versions, items);
}
