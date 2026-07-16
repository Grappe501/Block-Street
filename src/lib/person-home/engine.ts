import fs from "fs";
import path from "path";
import { getHomePlaceForUser, loadUsers } from "@/lib/auth/data";
import { getUserById } from "@/lib/auth/engine";
import { loadPositionStore } from "@/lib/position-participation/store";
import geographicClusters from "../../../data/volunteer-command/geographic-clusters.json";
import type { OnboardingResponse, OnboardingStage, PersonalHome, PersonalNextAction } from "./types";
import { projectGetLoudCard } from "@/lib/civic-resources/registry";

const STORE_PATH = path.join(process.cwd(), "data", "person-home", "store.json");

type Store = {
  onboarding_responses: OnboardingResponse[];
};

function loadStore(): Store {
  if (!fs.existsSync(STORE_PATH)) {
    return { onboarding_responses: [] };
  }
  return JSON.parse(fs.readFileSync(STORE_PATH, "utf8")) as Store;
}

function formatPositionTitle(positionId: string): string {
  return positionId
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function clusterForCounty(countySlug: string | undefined): { key: string; name: string } | null {
  if (!countySlug) return null;
  const row = geographicClusters.clusters.find((c) => c.county_slugs.includes(countySlug));
  return row ? { key: row.cluster_key, name: row.display_name } : null;
}

function mapOnboardingStatus(status: string | undefined): OnboardingStage {
  const map: Record<string, OnboardingStage> = {
    not_started: "registered",
    in_progress: "profile_started",
    complete: "profile_complete",
  };
  return map[status ?? ""] ?? "registered";
}

function nextActionForStage(stage: OnboardingStage, hasPlace: boolean): PersonalNextAction {
  if (!hasPlace) {
    return {
      id: "choose-place",
      title: "Choose your place",
      description: "Tell us your county, campus, or community so we can connect you to the right team.",
      href: "/choose-place",
      priority: 1,
      kind: "profile",
    };
  }
  if (stage === "registered" || stage === "profile_started") {
    return {
      id: "complete-profile",
      title: "Complete your profile",
      description: "Add your real name, photo, and how you prefer to be contacted.",
      href: "/home?panel=identity",
      priority: 1,
      kind: "profile",
    };
  }
  if (stage === "profile_complete" || stage === "onboarding") {
    return {
      id: "onboarding-prompts",
      title: "Tell us how you like to help",
      description: "A few warm questions so Outreach can suggest the right committee lane.",
      href: "/home?panel=onboarding",
      priority: 1,
      kind: "orientation",
    };
  }
  return {
    id: "first-meeting",
    title: "Join your committee's next meeting",
    description: "Meet your team and get your first assignment.",
    href: "/calendar",
    priority: 1,
    kind: "meeting",
  };
}

function findMembership(userId: string) {
  const store = loadPositionStore();
  return store.memberships.find((m) => m.canonical_person_id === userId && m.status === "active") ?? null;
}

export function buildPersonalHome(userId: string): PersonalHome | null {
  const user = getUserById(userId);
  if (!user) return null;

  const place = getHomePlaceForUser(userId);
  const stage = mapOnboardingStatus(user.onboarding_status);
  const cluster = clusterForCounty(place?.county_slug);
  const membership = findMembership(userId);
  const store = loadStore();
  const onboarding = store.onboarding_responses.find((r) => r.user_id === userId) ?? null;

  const hasPlace = Boolean(place);
  const disclosure: PersonalHome["disclosure_level"] =
    stage === "registered" || stage === "profile_started" ? "welcome" : stage === "profile_complete" ? "standard" : "full";

  const getLoud = projectGetLoudCard("compact");

  return {
    user_id: userId,
    welcome_name: user.preferred_name || user.display_name,
    onboarding_stage: onboarding?.chosen_lane ? "onboarding" : stage,
    identity: {
      display_name: user.display_name,
      preferred_name: user.preferred_name,
      avatar_url: user.avatar_url,
      city_county: place?.county_slug ? `${place.name}${place.county_slug ? ` · ${place.county_slug} County` : ""}` : null,
      institution_label: place?.kind === "school" || place?.kind === "high-school" || place?.kind === "private-school" ? place.name : null,
      communication_preference: null,
      real_name_required: true,
    },
    place: place
      ? {
          county: place.county_slug ?? null,
          county_slug: place.county_slug ?? null,
          cluster: cluster?.name ?? null,
          cluster_key: cluster?.key ?? null,
          institution: place.kind !== "county" ? place.name : null,
          committee_name: membership ? `${formatPositionTitle(membership.position_id)} Committee` : null,
          committee_id: membership ? `committee:${membership.scope_id}::${membership.position_id}` : null,
        }
      : null,
    role: membership
      ? {
          title: formatPositionTitle(membership.position_id),
          participation_type: membership.participation_type === "lead" ? "lead" : "volunteer",
          responsibilities: ["Show up prepared", "Support committee goals", "Ask your lead when unsure"],
          reports_to: "Committee Lead",
          support_contact: "Outreach team",
        }
      : {
          title: "Prospective volunteer",
          participation_type: "prospect",
          responsibilities: ["Complete onboarding", "Choose a committee lane"],
          reports_to: "Outreach",
          support_contact: "Outreach team",
        },
    next_action: nextActionForStage(stage, hasPlace),
    next_meeting: hasPlace
      ? {
          title: "Committee check-in (schedule TBD)",
          starts_at: new Date(Date.now() + 3 * 86400000).toISOString(),
          location: place?.name ?? "Local",
          href: "/calendar",
        }
      : null,
    committee_messages: [],
    people_to_know: membership
      ? [{ name: "Your committee lead", role: "Lead", href: membership.scope_id ? `/admin/committee/${membership.scope_id}` : null }]
      : [{ name: "Outreach team", role: "Onboarding support", href: "/command/outreach" }],
    progress: {
      tasks_completed: 0,
      meetings_attended: 0,
      volunteer_hours: 0,
      milestones: stage === "profile_complete" ? ["Profile started"] : [],
    },
    disclosure_level: disclosure,
    links: {
      network: "/network",
      choose_place: "/choose-place",
      calendar: "/calendar",
      outreach_queue: null,
    },
    explore_resources: getLoud
      ? [
          {
            id: "get-loud-registration",
            title: "Register or update voter information",
            description: getLoud.shortDescription,
            href: getLoud.learnHref,
            kind: "voter_registration" as const,
          },
        ]
      : [],
  };
}

export function getOnboardingResponse(userId: string): OnboardingResponse | null {
  return loadStore().onboarding_responses.find((r) => r.user_id === userId) ?? null;
}
