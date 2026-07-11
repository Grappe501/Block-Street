import type { DeliveryChannel, NotificationRequestInput, PolicyDecision } from "./types";
import { loadConsents, loadPreferences, loadQuietHours, loadSuppressions } from "./data";

const MANDATORY_TYPES = new Set(["auth.suspicious_login", "auth.password_changed", "auth.mfa_disabled", "auth.account_suspended"]);

const EVENT_DEFAULTS: Record<string, { category: string; priority: string; channels: DeliveryChannel[] }> = {
  "auth.suspicious_login": { category: "security", priority: "critical", channels: ["in_app", "email"] },
  "auth.password_changed": { category: "security", priority: "urgent", channels: ["in_app", "email"] },
  "mission.comment": { category: "mission", priority: "normal", channels: ["in_app"] },
  "mission.deadline_approaching": { category: "mission", priority: "important", channels: ["in_app", "digest"] },
  "content.submitted_for_review": { category: "content", priority: "normal", channels: ["in_app"] },
  "campaign.organization_announcement": { category: "organization", priority: "normal", channels: ["in_app", "email"] },
};

function parseTime(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function inQuietHours(now: Date, qh: { start_time: string; end_time: string }): boolean {
  const mins = now.getHours() * 60 + now.getMinutes();
  const start = parseTime(qh.start_time);
  const end = parseTime(qh.end_time);
  if (start > end) return mins >= start || mins < end;
  return mins >= start && mins < end;
}

function hasConsent(userId: string, channel: string, category: string): boolean {
  if (channel !== "sms" && channel !== "push") return true;
  const consents = loadConsents().filter((c) => c.user_id === userId && c.channel === channel);
  if (category === "security" || category === "transactional") {
    return consents.some((c) => c.status === "granted" && (c.category === "transactional" || c.category === category));
  }
  return consents.some((c) => c.status === "granted" && c.category === category);
}

function isSuppressed(userId: string, channel: string, destination?: string): boolean {
  return loadSuppressions().some(
    (s) =>
      (s.user_id_optional === userId || s.destination_reference === destination) &&
      (s.channel === channel || !s.channel) &&
      (!s.expires_at_optional || new Date(String(s.expires_at_optional)).getTime() > Date.now())
  );
}

export function getEventDefaults(eventType: string) {
  return EVENT_DEFAULTS[eventType] ?? { category: "system", priority: "normal", channels: ["in_app"] as DeliveryChannel[] };
}

export function evaluatePolicy(request: NotificationRequestInput, recipientEmail?: string): PolicyDecision {
  const defaults = getEventDefaults(request.event_type);
  const category = defaults.category;
  const priority = request.priority ?? defaults.priority;
  const mandatory = MANDATORY_TYPES.has(request.event_type) || priority === "critical";

  if (mandatory) {
    const channels = (request.recommended_channels ?? defaults.channels).filter(
      (ch) => ch !== "sms" || hasConsent(request.recipient_user_id, "sms", "security")
    );
    return { allowed_channels: channels, delivery_mode: "immediate", suppressed: false, mandatory: true };
  }

  const prefs = loadPreferences().filter((p) => p.user_id === request.recipient_user_id && p.category === category);
  const requested = request.recommended_channels ?? defaults.channels;
  const allowed: string[] = [];

  for (const ch of requested) {
    const pref = prefs.find((p) => p.channel === ch) ?? prefs.find((p) => p.channel === ch);
    const categoryPref = loadPreferences().find(
      (p) => p.user_id === request.recipient_user_id && p.notification_type_optional === request.event_type && p.channel === ch
    );
    const effective = categoryPref ?? pref;
    if (effective && !effective.enabled) continue;
    if (!hasConsent(request.recipient_user_id, ch, category)) continue;
    if (isSuppressed(request.recipient_user_id, ch, recipientEmail)) continue;
    if (ch === "email" && effective?.delivery_mode === "digest") continue;
    allowed.push(ch);
  }

  if (allowed.length === 0 && requested.includes("in_app")) {
    const inAppPref = prefs.find((p) => p.channel === "in_app");
    if (!inAppPref || inAppPref.enabled) allowed.push("in_app");
  }

  const qh = loadQuietHours().find((q) => q.user_id === request.recipient_user_id && q.enabled);
  let hold_until: string | undefined;
  if (qh && inQuietHours(new Date(), qh) && !["urgent", "critical"].includes(priority)) {
    if (allowed.includes("in_app")) {
      return { allowed_channels: ["in_app"], delivery_mode: "immediate", suppressed: false, mandatory: false };
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(parseTime(qh.end_time) / 60, parseTime(qh.end_time) % 60, 0, 0);
    hold_until = tomorrow.toISOString();
    return { allowed_channels: [], delivery_mode: "digest", suppressed: false, mandatory: false, hold_until };
  }

  if (allowed.length === 0) {
    return { allowed_channels: [], delivery_mode: "muted", suppressed: true, suppress_reason: "preference_or_consent", mandatory: false };
  }

  return {
    allowed_channels: allowed,
    delivery_mode: prefs.find((p) => p.delivery_mode === "digest") ? "digest" : "immediate",
    suppressed: false,
    mandatory: false,
  };
}
