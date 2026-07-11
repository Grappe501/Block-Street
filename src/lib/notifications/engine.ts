import { randomBytes } from "crypto";
import { getUserById } from "@/lib/auth/engine";
import { resolveMemberships } from "@/lib/auth/engine";
import {
  appendNotificationAudit,
  loadCampaigns,
  loadDeliveries,
  loadFailures,
  loadNotificationFeatureFlags,
  loadNotifications,
  loadPreferences,
  loadQueue,
  loadQuietHours,
  loadConsents,
  loadTemplates,
  persistCampaigns,
  persistDeliveries,
  persistNotifications,
  persistPreferences,
  persistQuietHours,
  persistConsents,
  persistQueue,
  readNotificationAudit,
} from "./data";
import { evaluatePolicy, getEventDefaults } from "./policy";
import { createDeliveryRecord, sendViaProvider } from "./provider";
import { isSafeActionUrl, renderTemplate, validateTemplateVariables } from "./template";
import type {
  CampaignPreview,
  Notification,
  NotificationCampaign,
  NotificationOverview,
  NotificationRequestInput,
  PolicyDecision,
} from "./types";

export class NotificationError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const DEDUP_WINDOW_MS = 5 * 60 * 1000;
const GROUP_WINDOW_MS = 5 * 60 * 1000;

function audit(actorId: string, action: string, result: string, extra?: Record<string, unknown>) {
  appendNotificationAudit({ actor_id: actorId, action, result, ...extra });
}

function assertEnabled() {
  const flags = loadNotificationFeatureFlags();
  if (!flags.NOTIFICATIONS_ENABLED) throw new NotificationError("Notifications are not enabled", 503);
}

export function getNotificationById(id: string): Notification | null {
  return loadNotifications().find((n) => n.id === id) ?? null;
}

export function listUserNotifications(userId: string, filters?: { unread?: boolean; category?: string; archived?: boolean }) {
  return loadNotifications()
    .filter((n) => n.recipient_user_id === userId)
    .filter((n) => {
      if (filters?.archived) return !!n.archived_at_optional;
      if (!filters?.archived && n.archived_at_optional) return false;
      if (filters?.unread) return !n.read;
      if (filters?.category) return n.category === filters.category;
      if (n.snoozed_until_optional && new Date(n.snoozed_until_optional).getTime() > Date.now()) return false;
      return true;
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function getUnreadCount(userId: string): number {
  return listUserNotifications(userId, { unread: true }).length;
}

function findDuplicate(request: NotificationRequestInput): Notification | null {
  if (!request.deduplication_key_optional) return null;
  const cutoff = Date.now() - DEDUP_WINDOW_MS;
  return (
    loadNotifications().find(
      (n) =>
        n.deduplication_key_optional === request.deduplication_key_optional &&
        n.recipient_user_id === request.recipient_user_id &&
        new Date(n.created_at).getTime() > cutoff
    ) ?? null
  );
}

function findGroupable(request: NotificationRequestInput): Notification | null {
  if (!request.grouping_key_optional) return null;
  const cutoff = Date.now() - GROUP_WINDOW_MS;
  return (
    loadNotifications().find(
      (n) =>
        n.grouping_key_optional === request.grouping_key_optional &&
        n.recipient_user_id === request.recipient_user_id &&
        !n.archived_at_optional &&
        !n.resolved &&
        new Date(n.created_at).getTime() > cutoff
    ) ?? null
  );
}

function resolveContent(request: NotificationRequestInput, templateKey: string) {
  const template = loadTemplates().find((t) => t.key === templateKey && t.status === "active");
  const vars = request.template_variables ?? {};
  if (template) {
    const err = validateTemplateVariables(template, vars);
    if (err) throw new NotificationError(err, 400);
    return {
      title: request.title ?? renderTemplate(template.title_template, vars),
      body: request.body ?? renderTemplate(template.body_template, vars),
      summary: request.summary ?? renderTemplate(template.summary_template ?? template.title_template, vars),
      action_label: request.action_label ?? (template.action_label_template ? renderTemplate(template.action_label_template, vars) : null),
      template_id: template.id,
      template_version: template.version,
      priority: request.priority ?? template.default_priority,
    };
  }
  return {
    title: request.title ?? request.event_type,
    body: request.body ?? "",
    summary: request.summary ?? "",
    action_label: request.action_label ?? null,
    template_id: "inline",
    template_version: 1,
    priority: request.priority ?? "normal",
  };
}

export function requestNotification(actorId: string, request: NotificationRequestInput): { notification: Notification; policy: PolicyDecision; duplicate?: boolean } {
  assertEnabled();
  if (!getUserById(request.recipient_user_id)) throw new NotificationError("Recipient not found", 404);
  if (request.action_url && !isSafeActionUrl(request.action_url)) throw new NotificationError("Unsafe action URL", 400);

  const duplicate = findDuplicate(request);
  if (duplicate) {
    audit(actorId, "notification_deduplicated", "success", { notification_id: duplicate.id });
    return { notification: duplicate, policy: { allowed_channels: [], delivery_mode: "immediate", suppressed: true, suppress_reason: "duplicate", mandatory: false }, duplicate: true };
  }

  const existing = findGroupable(request);
  if (existing) {
    const items = loadNotifications();
    const idx = items.findIndex((n) => n.id === existing.id);
    const count = (existing.group_count ?? 1) + 1;
    items[idx] = {
      ...items[idx],
      title: `${count} new comments on ${request.template_variables?.["mission.title"] ?? "your mission"}`,
      body: `${count} new updates were grouped.`,
      group_count: count,
      read: false,
    };
    persistNotifications(items);
    audit(actorId, "notification_grouped", "success", { notification_id: existing.id, group_count: count });
    return { notification: items[idx], policy: { allowed_channels: ["in_app"], delivery_mode: "immediate", suppressed: false, mandatory: false } };
  }

  const recipient = getUserById(request.recipient_user_id)!;
  const policy = evaluatePolicy(request, recipient.primary_email);
  const content = resolveContent(request, request.template_key);
  const defaults = getEventDefaults(request.event_type);
  const now = new Date().toISOString();
  const id = `ntf-${randomBytes(6).toString("hex")}`;

  const notification: Notification = {
    id,
    public_id: `pub-${id}`,
    notification_type: request.event_type,
    category: defaults.category,
    source_system: request.source_system,
    source_event_id: request.source_event_id ?? `evt-${randomBytes(4).toString("hex")}`,
    source_entity_type: request.source_entity.type,
    source_entity_id: request.source_entity.id,
    organization_id_optional: request.organization_id_optional ?? null,
    workspace_id_optional: request.workspace_id_optional ?? null,
    recipient_user_id: request.recipient_user_id,
    priority: content.priority,
    severity: request.severity ?? "low",
    title: content.title,
    body: content.body,
    summary: content.summary,
    action_label_optional: content.action_label,
    action_url_optional: request.action_url ?? null,
    status: policy.suppressed ? "suppressed" : policy.hold_until ? "queued" : "processing",
    read: false,
    scheduled_at: policy.hold_until ?? request.scheduled_at_optional ?? null,
    created_at: now,
    expires_at_optional: request.expires_at_optional ?? null,
    sent_at_optional: null,
    delivered_at_optional: null,
    opened_at_optional: null,
    acted_at_optional: null,
    dismissed_at_optional: null,
    archived_at_optional: null,
    snoozed_until_optional: null,
    deduplication_key_optional: request.deduplication_key_optional ?? null,
    grouping_key_optional: request.grouping_key_optional ?? null,
    group_count: 1,
    template_id: content.template_id,
    template_version: content.template_version,
    correlation_id: `corr-${randomBytes(4).toString("hex")}`,
    resolved: false,
  };

  const items = loadNotifications();
  items.push(notification);
  persistNotifications(items);

  if (policy.suppressed) {
    audit(actorId, "notification_suppressed", "success", { notification_id: id, reason: policy.suppress_reason });
    return { notification, policy };
  }

  if (policy.hold_until) {
    const q = loadQueue();
    q.queue.push({
      id: `q-${randomBytes(4).toString("hex")}`,
      notification_id: id,
      channel: "email",
      status: "queued",
      priority: content.priority,
      source_system: request.source_system,
      recipient_user_id: request.recipient_user_id,
      queued_at: now,
      scheduled_for: policy.hold_until,
      reason: "quiet_hours_hold",
    });
    persistQueue(q);
    audit(actorId, "notification_queued", "success", { notification_id: id, hold_until: policy.hold_until });
    return { notification, policy };
  }

  deliverNotification(notification, policy.allowed_channels, recipient.primary_email);
  audit(actorId, "notification_requested", "success", { notification_id: id, channels: policy.allowed_channels });
  return { notification, policy };
}

function deliverNotification(notification: Notification, channels: string[], email: string) {
  const deliveries = loadDeliveries();
  const now = new Date().toISOString();
  let anySuccess = false;

  for (const ch of channels) {
    const dest = ch === "email" ? email : ch === "sms" ? "" : notification.recipient_user_id;
    const result = sendViaProvider(ch, dest, { title: notification.title, body: notification.body });
    const delivery = createDeliveryRecord(notification.id, ch, dest, result);
    deliveries.push(delivery);
    if (result.success) anySuccess = true;
    else {
      audit("system", "notification_delivery_failed", "failure", {
        notification_id: notification.id,
        channel: ch,
        failure_code: result.failure_code,
      });
    }
  }

  const items = loadNotifications();
  const idx = items.findIndex((n) => n.id === notification.id);
  if (idx >= 0) {
    items[idx] = {
      ...items[idx],
      status: anySuccess ? "delivered" : "failed",
      sent_at_optional: now,
      delivered_at_optional: anySuccess ? now : null,
    };
    persistNotifications(items);
  }
  persistDeliveries(deliveries);
}

function updateNotification(id: string, userId: string, patch: Partial<Notification>) {
  const items = loadNotifications();
  const idx = items.findIndex((n) => n.id === id);
  if (idx < 0) throw new NotificationError("Notification not found", 404);
  if (items[idx].recipient_user_id !== userId) throw new NotificationError("Not authorized", 403);
  items[idx] = { ...items[idx], ...patch };
  persistNotifications(items);
  return items[idx];
}

export function markRead(userId: string, id: string) {
  const now = new Date().toISOString();
  const n = updateNotification(id, userId, { read: true, opened_at_optional: now, status: "opened" });
  audit(userId, "notification_read", "success", { notification_id: id });
  return n;
}

export function markUnread(userId: string, id: string) {
  return updateNotification(id, userId, { read: false });
}

export function dismissNotification(userId: string, id: string) {
  const n = updateNotification(id, userId, { dismissed_at_optional: new Date().toISOString() });
  audit(userId, "notification_dismissed", "success", { notification_id: id });
  return n;
}

export function archiveNotification(userId: string, id: string) {
  const n = updateNotification(id, userId, { archived_at_optional: new Date().toISOString(), status: "archived" });
  audit(userId, "notification_archived", "success", { notification_id: id });
  return n;
}

export function snoozeNotification(userId: string, id: string, until: string) {
  const n = updateNotification(id, userId, { snoozed_until_optional: until });
  audit(userId, "notification_snoozed", "success", { notification_id: id, until });
  return n;
}

export function markAllRead(userId: string) {
  const items = loadNotifications();
  const now = new Date().toISOString();
  for (const n of items) {
    if (n.recipient_user_id === userId && !n.read) {
      n.read = true;
      n.opened_at_optional = now;
    }
  }
  persistNotifications(items);
  audit(userId, "notifications_read_all", "success");
  return { updated: items.filter((n) => n.recipient_user_id === userId && n.read).length };
}

export function resolveNotification(entityType: string, entityId: string) {
  const items = loadNotifications();
  let count = 0;
  for (const n of items) {
    if (n.source_entity_type === entityType && n.source_entity_id === entityId && !n.resolved) {
      n.resolved = true;
      n.status = "resolved";
      count++;
    }
  }
  if (count) persistNotifications(items);
  return count;
}

export function getUserPreferences(userId: string) {
  return loadPreferences().filter((p) => p.user_id === userId);
}

export function updateUserPreferences(userId: string, updates: Partial<import("./types").NotificationPreference>[]) {
  const all = loadPreferences();
  for (const u of updates) {
    const idx = all.findIndex((p) => p.id === u.id && p.user_id === userId);
    if (idx >= 0) all[idx] = { ...all[idx], ...u, updated_at: new Date().toISOString() };
  }
  persistPreferences(all);
  audit(userId, "preference_changed", "success");
  return all.filter((p) => p.user_id === userId);
}

export function getUserQuietHours(userId: string) {
  return loadQuietHours().find((q) => q.user_id === userId) ?? null;
}

export function updateUserQuietHours(userId: string, patch: Partial<import("./types").QuietHours>) {
  const all = loadQuietHours();
  const idx = all.findIndex((q) => q.user_id === userId);
  const record = {
    user_id: userId,
    enabled: true,
    start_time: "22:00",
    end_time: "07:00",
    timezone: "America/Chicago",
    weekend_behavior: "same",
    updated_at: new Date().toISOString(),
    ...patch,
  };
  if (idx >= 0) all[idx] = { ...all[idx], ...record };
  else all.push(record as import("./types").QuietHours);
  persistQuietHours(all);
  audit(userId, "quiet_hours_changed", "success");
  return record;
}

export function getUserConsents(userId: string) {
  return loadConsents().filter((c) => c.user_id === userId);
}

export function updateUserConsent(userId: string, consentId: string, status: string) {
  const all = loadConsents();
  const idx = all.findIndex((c) => c.id === consentId && c.user_id === userId);
  if (idx < 0) throw new NotificationError("Consent not found", 404);
  const now = new Date().toISOString();
  all[idx] = {
    ...all[idx],
    status,
    granted_at: status === "granted" ? now : all[idx].granted_at,
    revoked_at: status === "revoked" ? now : all[idx].revoked_at,
  };
  persistConsents(all);
  audit(userId, status === "revoked" ? "consent_revoked" : "consent_granted", "success", { consent_id: consentId });
  return all[idx];
}

export function previewCampaign(campaign: NotificationCampaign): CampaignPreview {
  const memberships = resolveMemberships("usr-001");
  const orgId = campaign.organization_id;
  const audience = memberships.filter((m) => m.organization_id === orgId).length || campaign.estimated_recipient_count;
  const consents = loadConsents();
  const smsEligible = consents.filter((c) => c.channel === "sms" && c.status === "granted").length;
  return {
    audience_count: campaign.estimated_recipient_count || audience,
    channels: campaign.channels,
    sms_eligible: smsEligible,
    suppressed: 3,
    estimated_email: Math.max(0, campaign.estimated_recipient_count - 3),
    estimated_sms: campaign.channels.includes("sms") ? smsEligible : 0,
    quiet_hour_delayed: 12,
    consent_issues: campaign.channels.includes("sms") ? Math.max(0, campaign.estimated_recipient_count - smsEligible) : 0,
    duplicate_suppression: 0,
    approval_required: true,
  };
}

export function createCampaign(userId: string, input: Partial<NotificationCampaign>) {
  assertEnabled();
  const id = `camp-${randomBytes(4).toString("hex")}`;
  const campaign: NotificationCampaign = {
    id,
    name: input.name ?? "Untitled Campaign",
    organization_id: input.organization_id ?? "org-statewide-campaign",
    workspace_id_optional: input.workspace_id_optional ?? null,
    category: input.category ?? "organization",
    audience_definition: input.audience_definition ?? { type: "organization_members" },
    estimated_recipient_count: input.estimated_recipient_count ?? 0,
    channels: input.channels ?? ["in_app", "email"],
    template_ids: input.template_ids ?? [],
    template_variables: input.template_variables ?? {},
    status: "draft",
    created_by: userId,
    approved_by_optional: null,
    scheduled_at_optional: null,
    sent_at_optional: null,
    cancelled_at_optional: null,
    execution_key: `${id}-exec-v1`,
    executed: false,
    created_at: new Date().toISOString(),
  };
  const all = loadCampaigns();
  all.push(campaign);
  persistCampaigns(all);
  audit(userId, "campaign_created", "success", { campaign_id: id });
  return campaign;
}

export function submitCampaignApproval(userId: string, campaignId: string) {
  const all = loadCampaigns();
  const idx = all.findIndex((c) => c.id === campaignId);
  if (idx < 0) throw new NotificationError("Campaign not found", 404);
  all[idx] = { ...all[idx], status: "awaiting_approval" };
  persistCampaigns(all);
  audit(userId, "campaign_submitted", "success", { campaign_id: campaignId });
  return all[idx];
}

export function approveCampaign(userId: string, campaignId: string) {
  const all = loadCampaigns();
  const idx = all.findIndex((c) => c.id === campaignId);
  if (idx < 0) throw new NotificationError("Campaign not found", 404);
  all[idx] = { ...all[idx], status: "approved", approved_by_optional: userId };
  persistCampaigns(all);
  audit(userId, "campaign_approved", "success", { campaign_id: campaignId });
  return all[idx];
}

export function sendCampaign(userId: string, campaignId: string) {
  const all = loadCampaigns();
  const idx = all.findIndex((c) => c.id === campaignId);
  if (idx < 0) throw new NotificationError("Campaign not found", 404);
  const campaign = all[idx];
  if (campaign.executed) throw new NotificationError("Campaign already executed", 409);
  if (campaign.status !== "approved" && campaign.status !== "awaiting_approval") {
    throw new NotificationError("Campaign must be approved before sending", 400);
  }
  all[idx] = { ...all[idx], status: "sent", sent_at_optional: new Date().toISOString(), executed: true };
  persistCampaigns(all);
  audit(userId, "campaign_sent", "success", { campaign_id: campaignId, recipients: campaign.estimated_recipient_count });
  return { campaign: all[idx], sent_count: campaign.estimated_recipient_count };
}

export function getNotificationOverview(): NotificationOverview {
  const notifications = loadNotifications();
  const deliveries = loadDeliveries();
  const failures = loadFailures();
  const campaigns = loadCampaigns();
  const queue = loadQueue();
  const today = new Date().toISOString().slice(0, 10);
  const sentToday = notifications.filter((n) => n.sent_at_optional?.startsWith(today)).length;
  const delivered = deliveries.filter((d) => d.status === "delivered").length;
  const total = deliveries.length || 1;
  return {
    queued: queue.queue.length,
    sent_today: sentToday,
    delivery_rate: Math.round((delivered / total) * 1000) / 10,
    failed: failures.length,
    bounced: failures.filter((f) => f.failure_code === "hard_bounce").length,
    suppressed: notifications.filter((n) => n.status === "suppressed").length,
    pending_approvals: campaigns.filter((c) => c.status === "awaiting_approval").length,
    provider_health: "operational",
    average_queue_delay_seconds: 12,
    dead_letter: failures.filter((f) => f.status === "dead_letter").length,
    critical_failures: 0,
  };
}

export { readNotificationAudit, loadTemplates, loadCampaigns, loadQueue, loadFailures };
