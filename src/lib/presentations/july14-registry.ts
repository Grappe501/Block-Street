import agendaJson from "./july-14-agenda.json";

export type July14AgendaItem = {
  item_number: string;
  aliases: string[];
  sequence: number;
  title: string;
  duration_minutes: number;
  section: string;
  source_reference: string;
  presenter_content: string[];
  participant_content: string[];
  current_route: string;
  item_route: string;
  supporting_module: string;
  drill_down_route: string;
  primary_action: string;
  position_id: string | null;
  family: string;
  slide_id: string;
  status: string;
  notes: string[];
};

export type July14AgendaRegistry = {
  version: string;
  meeting: string;
  finding: { requested_range: string; status: string; note: string };
  total_meeting_minutes_target: number;
  total_leaf_duration_minutes: number;
  timing_note: string;
  honesty: { working_now: string[]; still_being_completed: string[] };
  canonical_sources: string[];
  items: July14AgendaItem[];
};

export const JULY14_AGENDA_REGISTRY = agendaJson as July14AgendaRegistry;

export function listJuly14Items(): July14AgendaItem[] {
  return JULY14_AGENDA_REGISTRY.items;
}

export function getJuly14Item(raw: string): July14AgendaItem | null {
  const key = decodeURIComponent(raw).trim();
  const normalized = key === "034" ? "34" : key.replace(/^0+(\d)$/, "0$1");
  return (
    JULY14_AGENDA_REGISTRY.items.find(
      (item) =>
        item.item_number === key ||
        item.item_number === normalized ||
        item.aliases.includes(key) ||
        item.item_number === key.padStart(2, "0") ||
        (key === "034" && item.item_number === "34"),
    ) ?? null
  );
}

export function getJuly14Neighbors(itemNumber: string): {
  prev: July14AgendaItem | null;
  next: July14AgendaItem | null;
} {
  const items = listJuly14Items();
  const idx = items.findIndex(
    (item) => item.item_number === itemNumber || item.aliases.includes(itemNumber),
  );
  if (idx < 0) return { prev: null, next: null };
  return {
    prev: idx > 0 ? items[idx - 1]! : null,
    next: idx < items.length - 1 ? items[idx + 1]! : null,
  };
}

export function july14ReturnHref(itemNumber: string, mode: "presenter" | "participant" | "deck" = "deck"): string {
  if (mode === "presenter") return `/presentations/july-14/presenter?item=${itemNumber}`;
  if (mode === "participant") return `/presentations/july-14/participant?item=${itemNumber}`;
  return `/presentations/july-14/items/${itemNumber}`;
}

export function july14DrillHref(item: July14AgendaItem, mode: "presenter" | "participant"): string {
  const url = new URL(item.drill_down_route, "https://block-street.local");
  url.searchParams.set("from", "july14");
  url.searchParams.set("item", item.item_number);
  url.searchParams.set("mode", mode);
  return `${url.pathname}${url.search}`;
}
