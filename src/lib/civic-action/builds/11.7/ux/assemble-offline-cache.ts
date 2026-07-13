/**
 * CAE-11.7-W4 — Offline sync manifest stub
 */
import { nowIso } from "../../../utils";
import { t } from "./locale";
import type { OfflineCacheManifestView } from "./view-models";

export function assembleOfflineCacheManifest(locale: "en" | "es" = "en"): OfflineCacheManifestView {
  return {
    cached_at: nowIso(),
    views: [
      { key: "home", label: "Communications Home", stale_after_minutes: 15 },
      { key: "brief", label: "Daily Brief", stale_after_minutes: 30 },
      { key: "mission_conversation", label: "Mission Conversation", stale_after_minutes: 10 },
      { key: "notifications", label: "Notifications", stale_after_minutes: 5 },
    ],
    sync_status: "fresh",
    title: t(locale, "offline.title"),
    body: t(locale, "offline.body"),
  };
}
