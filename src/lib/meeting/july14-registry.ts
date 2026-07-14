/**
 * Soft-beta July 14 meeting checklist registry.
 * Mirrors presentation agenda slides — does not rewrite slide titles.
 */
import { JULY14_AGENDA_SLIDES } from "@/lib/presentations/july14-agenda";

export const JULY14_CHECKLIST_STORAGE_KEY = "asyon:soft-beta:july14-checklist";
export const JOIN_INTEREST_STORAGE_KEY = "asyon:soft-beta:join-interest";

export type July14AgendaItem = {
  id: string;
  title: string;
  kicker: string;
  slideIndex: number;
  presentationHref: string;
};

export type JoinInterestRecord = {
  savedAt: string;
  name: string;
  campusOrPlace: string;
  positionId: string;
  note: string;
  contactOk: boolean;
};

export function getJuly14AgendaItems(): July14AgendaItem[] {
  return JULY14_AGENDA_SLIDES.map((slide, slideIndex) => ({
    id: slide.id,
    title: slide.title,
    kicker: slide.kicker,
    slideIndex,
    presentationHref: `/presentations/july-14?slide=${slideIndex}`,
  }));
}

export function presentationHrefForItem(itemId: string): string | null {
  // Numeric agenda leaves (01–34 / 034) from data/presentation/july-14-agenda.json
  if (/^\d{1,3}$/.test(itemId) || itemId === "034") {
    const n = itemId === "034" ? "34" : itemId.padStart(2, "0");
    return `/presentations/july-14/participant?item=${n}`;
  }
  const item = getJuly14AgendaItems().find((row) => row.id === itemId);
  return item?.presentationHref ?? null;
}

export type ChecklistState = Record<string, boolean>;

export function readJuly14Checklist(): ChecklistState {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(JULY14_CHECKLIST_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ChecklistState;
  } catch {
    return {};
  }
}

export function writeJuly14Checklist(state: ChecklistState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(JULY14_CHECKLIST_STORAGE_KEY, JSON.stringify(state));
}

export function readJoinInterests(): JoinInterestRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(JOIN_INTEREST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as JoinInterestRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function appendJoinInterest(record: Omit<JoinInterestRecord, "savedAt">): JoinInterestRecord {
  const next: JoinInterestRecord = { ...record, savedAt: new Date().toISOString() };
  if (typeof window === "undefined") return next;
  const all = readJoinInterests();
  all.push(next);
  window.localStorage.setItem(JOIN_INTEREST_STORAGE_KEY, JSON.stringify(all));
  return next;
}
