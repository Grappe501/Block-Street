import { readFileSync } from "fs";
import { join } from "path";

const DATA = join(process.cwd(), "data", "identity-trust");

export function loadJuly14Flags() {
  return JSON.parse(readFileSync(join(DATA, "july14_flags.json"), "utf8")) as Record<string, boolean>;
}

export function loadJuly14Demo() {
  return JSON.parse(readFileSync(join(DATA, "july14_demo.json"), "utf8")) as July14Demo;
}

export type ImplementationMode = "live" | "demo" | "locked";

export interface July14Demo {
  meeting: {
    title: string;
    date: string;
    time: string;
    host: string;
    institution_id: string;
    participant_count: number;
    agenda: string[];
  };
  institutions: Record<string, { name: string; short_name: string }>;
  demo_humans: {
    id: string;
    label: string;
    role: string;
    public_name: string;
    user_id: string;
    trust_label: string;
    mode: ImplementationMode;
  }[];
  system_status: { name: string; mode: ImplementationMode; note?: string }[];
  audit_lineage_demo: { step: number; event: string; actor: string; at: string }[];
  admin_overview_demo: Record<string, string | number>;
}

export function getInstitutionDisplayName(institutionId: string) {
  const demo = loadJuly14Demo();
  return demo.institutions[institutionId]?.name ?? institutionId;
}

export function maskGlobalHumanId(ghid: string) {
  if (ghid.length <= 8) return ghid;
  return `${ghid.slice(0, 4)}${"*".repeat(Math.min(8, ghid.length - 4))}`;
}

export function getJuly14EntryRoute(state: {
  authenticated: boolean;
  has_invitation_token?: boolean;
  has_membership?: boolean;
  is_restricted?: boolean;
  membership_count?: number;
}) {
  if (state.has_invitation_token) return "/invite";
  if (!state.authenticated) return "/join";
  if (state.is_restricted) return "/identity?status=restricted";
  if ((state.membership_count ?? 0) > 1) return "/identity/institutions";
  if (state.has_membership) return "/july-14";
  return "/identity";
}
