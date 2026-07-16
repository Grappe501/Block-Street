import { listAssignments } from "../assignments/store";
import { getShiftById } from "../staffing/store";

function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return new Date(aStart) < new Date(bEnd) && new Date(bStart) < new Date(aEnd);
}

export function detectVolunteerAssignmentConflicts(): {
  eventIds: [string, string];
  humanIds: string[];
  summary: string;
  severity: "medium" | "high";
}[] {
  const active = listAssignments({ activeOnly: true });
  const found: {
    eventIds: [string, string];
    humanIds: string[];
    summary: string;
    severity: "medium" | "high";
  }[] = [];
  for (let i = 0; i < active.length; i++) {
    for (let j = i + 1; j < active.length; j++) {
      const a = active[i];
      const b = active[j];
      if (a.volunteerUserId !== b.volunteerUserId) continue;
      if (!overlaps(a.startAt, a.endAt, b.startAt, b.endAt)) continue;
      const shiftA = getShiftById(a.shiftId);
      const shiftB = getShiftById(b.shiftId);
      const eventA = shiftA?.eventId ?? a.eventId;
      const eventB = shiftB?.eventId ?? b.eventId;
      if (!eventA || !eventB || eventA === eventB) continue;
      found.push({
        eventIds: [eventA, eventB],
        humanIds: [a.volunteerUserId],
        summary: `Volunteer ${a.volunteerUserId} double-booked across shifts on overlapping events`,
        severity: "high",
      });
    }
  }
  return found;
}
