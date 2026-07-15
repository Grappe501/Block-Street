import type { CalendarPersonalScheduleItem } from "./types";
import { listAssignments, listOffers, listWaitlistEntries, listCancellations } from "./store";
import { listMyInterests } from "../staffing/leads";
import { listLeadAssignments } from "../staffing/store";
import { getEventById, listMyScheduleEvents } from "../events";
import { getShiftById } from "../staffing/store";

export function buildPersonalSchedule(volunteerUserId: string): {
  softBetaConfirmed: CalendarPersonalScheduleItem[];
  pendingOffers: CalendarPersonalScheduleItem[];
  leadCommitments: CalendarPersonalScheduleItem[];
  waitlists: CalendarPersonalScheduleItem[];
  interests: CalendarPersonalScheduleItem[];
  rsvps: CalendarPersonalScheduleItem[];
  trainingNeeded: CalendarPersonalScheduleItem[];
  canceledOrReplaced: CalendarPersonalScheduleItem[];
} {
  const sections = {
    softBetaConfirmed: [] as CalendarPersonalScheduleItem[],
    pendingOffers: [] as CalendarPersonalScheduleItem[],
    leadCommitments: [] as CalendarPersonalScheduleItem[],
    waitlists: [] as CalendarPersonalScheduleItem[],
    interests: [] as CalendarPersonalScheduleItem[],
    rsvps: [] as CalendarPersonalScheduleItem[],
    trainingNeeded: [] as CalendarPersonalScheduleItem[],
    canceledOrReplaced: [] as CalendarPersonalScheduleItem[],
  };

  for (const a of listAssignments({ volunteerUserId })) {
    const event = getEventById(a.eventId);
    const title = event?.title ?? a.eventId;
    if (a.assignmentStatus === "soft_beta_confirmed" || a.assignmentStatus === "confirmed") {
      sections.softBetaConfirmed.push({
        itemId: a.assignmentId,
        sourceType: "assignment",
        authorityLevel: a.softBeta ? "soft_beta_confirmed" : "durable_confirmed",
        eventId: a.eventId,
        shiftId: a.shiftId,
        title,
        roleLabel: a.roleLabel,
        startAt: a.startAt,
        endAt: a.endAt,
        arrivalAt: a.arrivalAt,
        statusLabel: a.softBeta ? "Confirmed in soft beta" : "Confirmed",
        actionRoute: `/calendar/my-shifts`,
        warnings: a.trainingConditionStatus === "pending" ? ["Training condition pending"] : [],
      });
      if (a.trainingConditionStatus === "pending") {
        sections.trainingNeeded.push({
          itemId: `train-${a.assignmentId}`,
          sourceType: "assignment",
          authorityLevel: "soft_beta_confirmed",
          eventId: a.eventId,
          shiftId: a.shiftId,
          title,
          roleLabel: a.roleLabel,
          startAt: a.startAt,
          endAt: a.endAt,
          statusLabel: "Training needed before shift",
          warnings: a.trainingConditionKeys.map((k) => `Training: ${k}`),
        });
      }
    } else if (
      ["canceled_by_volunteer", "canceled_by_manager", "replaced", "cancellation_requested"].includes(a.assignmentStatus)
    ) {
      sections.canceledOrReplaced.push({
        itemId: a.assignmentId,
        sourceType: "assignment",
        authorityLevel: "planning_only",
        eventId: a.eventId,
        shiftId: a.shiftId,
        title,
        roleLabel: a.roleLabel,
        startAt: a.startAt,
        endAt: a.endAt,
        statusLabel: a.assignmentStatus.replace(/_/g, " "),
        warnings: [],
      });
    }
  }

  for (const o of listOffers({ volunteerUserId })) {
    if (!["offered", "viewed", "ready"].includes(o.offerStatus)) continue;
    const event = getEventById(o.eventId);
    sections.pendingOffers.push({
      itemId: o.offerId,
      sourceType: "offer",
      authorityLevel: "pending_response",
      eventId: o.eventId,
      shiftId: o.shiftId,
      title: event?.title ?? o.eventId,
      roleLabel: o.offeredRoleLabel,
      startAt: o.offeredStartAt,
      endAt: o.offeredEndAt,
      arrivalAt: o.offeredArrivalAt,
      statusLabel: "Offer awaiting response",
      actionRoute: `/calendar/shift-offer/${o.offerId}`,
      warnings: o.expiresAt ? [`Expires ${o.expiresAt}`] : [],
    });
  }

  for (const w of listWaitlistEntries({ volunteerUserId })) {
    if (w.waitlistStatus !== "active" && w.waitlistStatus !== "offered") continue;
    const shift = getShiftById(w.shiftId);
    const event = getEventById(w.eventId);
    sections.waitlists.push({
      itemId: w.waitlistEntryId,
      sourceType: "waitlist",
      authorityLevel: "waitlisted",
      eventId: w.eventId,
      shiftId: w.shiftId,
      title: event?.title ?? w.eventId,
      roleLabel: shift?.roleLabel ?? null,
      startAt: shift?.startAt ?? w.addedAt,
      endAt: shift?.endAt ?? w.addedAt,
      statusLabel: "Waitlisted",
      actionRoute: `/calendar/my-waitlists`,
      warnings: [],
    });
  }

  for (const i of listMyInterests(volunteerUserId)) {
    const event = getEventById(i.eventId);
    const shift = i.shiftId ? getShiftById(i.shiftId) : null;
    sections.interests.push({
      itemId: i.interestId,
      sourceType: "interest",
      authorityLevel: "interest_only",
      eventId: i.eventId,
      shiftId: i.shiftId,
      title: event?.title ?? i.eventId,
      roleLabel: shift?.roleLabel ?? null,
      startAt: shift?.startAt ?? i.createdAt,
      endAt: shift?.endAt ?? i.createdAt,
      statusLabel: "Interest received",
      actionRoute: `/calendar/my-volunteer-interests`,
      warnings: [],
    });
  }

  for (const l of listLeadAssignments().filter((x) => x.userId === volunteerUserId)) {
    const shift = getShiftById(l.shiftId);
    sections.leadCommitments.push({
      itemId: l.assignmentId,
      sourceType: "lead",
      authorityLevel: l.status === "accepted" ? "soft_beta_confirmed" : "pending_response",
      eventId: shift?.eventId ?? "",
      shiftId: l.shiftId,
      title: shift ? getEventById(shift.eventId)?.title ?? shift.eventId : l.shiftId,
      roleLabel: l.role.replace(/_/g, " "),
      startAt: shift?.startAt ?? l.assignedAt ?? new Date().toISOString(),
      endAt: shift?.endAt ?? l.assignedAt ?? new Date().toISOString(),
      statusLabel: l.status === "accepted" ? "Lead accepted (soft beta)" : "Lead invited",
      warnings: [],
    });
  }

  if (volunteerUserId === "usr-demo-001") {
    for (const e of listMyScheduleEvents()) {
      sections.rsvps.push({
        itemId: `rsvp-${e.event_id}`,
        sourceType: "rsvp",
        authorityLevel: "planning_only",
        eventId: e.event_id,
        title: e.title,
        startAt: e.start_at ?? new Date().toISOString(),
        endAt: e.end_at ?? e.start_at ?? new Date().toISOString(),
        statusLabel: "Personal RSVP",
        actionRoute: `/calendar/event/${e.event_id}`,
        warnings: [],
      });
    }
  }

  for (const c of listCancellations()) {
    if (c.volunteerUserId !== volunteerUserId) continue;
    if (c.cancellationStatus !== "completed" && c.cancellationStatus !== "approved") continue;
    const event = getEventById(c.eventId);
    sections.canceledOrReplaced.push({
      itemId: c.cancellationId,
      sourceType: "assignment",
      authorityLevel: "planning_only",
      eventId: c.eventId,
      shiftId: c.shiftId,
      title: event?.title ?? c.eventId,
      startAt: c.requestedAt,
      endAt: c.resolvedAt ?? c.requestedAt,
      statusLabel: "Cancellation completed",
      warnings: [],
    });
  }

  return sections;
}

export function projectVolunteerSafeSchedule(volunteerUserId: string, viewerUserId: string) {
  if (volunteerUserId !== viewerUserId) return null;
  return buildPersonalSchedule(volunteerUserId);
}
