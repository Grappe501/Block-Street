/**
 * CAE-11.1-W7 — Institutional memory from completed Initiatives
 */
import { caeId } from "../../../utils";
import { initiativeApplicationService } from "../services/application-service";
import type { InstitutionalMemoryEntry } from "./contracts";

export function buildInstitutionalMemory(institutionId: string): InstitutionalMemoryEntry[] {
  const entries: InstitutionalMemoryEntry[] = [];

  for (const id of initiativeApplicationService.listInitiativeIds()) {
    const agg = initiativeApplicationService.getAggregate(id);
    if (!agg || agg.initiative.institution_id !== institutionId) continue;
    if (!["completed", "archived"].includes(agg.initiative.status)) continue;

    const lessons = agg.closeout?.lessons_learned ?? null;
    const closeoutReason = agg.closeout?.reason ?? null;
    const historyDecisions = agg.history
      .filter((h) => h.event_type.includes("approved") || h.event_type.includes("status"))
      .slice(-3)
      .map((h) => `${h.event_type}: ${h.reason ?? "no reason recorded"}`)
      .join("; ");

    entries.push({
      memory_id: caeId("mem"),
      initiative_id: id,
      initiative_name: agg.initiative.initiative_name,
      decision_summary: historyDecisions || closeoutReason || "Lifecycle completed",
      what_worked: lessons ? lessons.slice(0, 200) : null,
      what_failed: agg.closeout?.unfinished_obligations ?? null,
      lessons,
      occurred_at: agg.initiative.updated_at,
      searchable_text: [
        agg.initiative.initiative_name,
        agg.charter?.purpose,
        lessons,
        closeoutReason,
        historyDecisions,
      ]
        .filter(Boolean)
        .join(" "),
    });
  }

  return entries.sort((a, b) => b.occurred_at.localeCompare(a.occurred_at));
}

export function searchInstitutionalMemory(institutionId: string, query: string) {
  const q = query.toLowerCase();
  return buildInstitutionalMemory(institutionId).filter((m) => m.searchable_text.toLowerCase().includes(q));
}
