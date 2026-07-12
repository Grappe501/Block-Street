import { loadHumanIdentities } from "../data";
import { itlId, nowIso } from "../utils";
import { loadDirectoryPreferences, persistDirectoryPreferences } from "./data";
import type { HumanDirectoryPreference } from "./types";

export function getDirectoryPreference(humanId: string): HumanDirectoryPreference {
  const existing = loadDirectoryPreferences().find((p) => p.human_id === humanId);
  if (existing) return existing;
  return {
    human_id: humanId,
    visibility_scope: "institution_only",
    visible_institutions: [],
    contact_mode: "platform_message",
    updated_at: nowIso(),
  };
}

export function updateDirectoryPreference(
  humanId: string,
  patch: Partial<Pick<HumanDirectoryPreference, "visibility_scope" | "visible_institutions" | "contact_mode">>
): HumanDirectoryPreference {
  const prefs = loadDirectoryPreferences().filter((p) => p.human_id !== humanId);
  const updated: HumanDirectoryPreference = {
    ...getDirectoryPreference(humanId),
    ...patch,
    human_id: humanId,
    updated_at: nowIso(),
  };
  prefs.push(updated);
  persistDirectoryPreferences(prefs);
  return updated;
}

export function searchFederationDirectory(input: {
  query: string;
  purpose: string;
  searching_human_id: string;
  institution_id: string;
  scope?: HumanDirectoryPreference["visibility_scope"];
}) {
  const q = input.query.toLowerCase().trim();
  const identities = loadHumanIdentities();
  const prefs = loadDirectoryPreferences();

  return identities
    .filter((i) => {
      if (!q) return false;
      const pref = prefs.find((p) => p.human_id === i.user_id) ?? getDirectoryPreference(i.user_id);
      if (pref.visibility_scope === "not_discoverable") return false;
      if (pref.visibility_scope === "institution_only" && input.institution_id !== i.institution_id) return false;
      return (
        i.public_name.toLowerCase().includes(q) ||
        i.global_human_id.toLowerCase().includes(q)
      );
    })
    .map((i) => ({
      global_human_id: i.global_human_id,
      public_name: i.public_name,
      public_badge: i.public_badge,
      verified_human: i.trust_label === "verified" || i.trust_label === "trusted",
      contact_mode: (prefs.find((p) => p.human_id === i.user_id) ?? getDirectoryPreference(i.user_id)).contact_mode,
      search_purpose: input.purpose,
      audit_id: itlId("dir-audit"),
    }));
}
