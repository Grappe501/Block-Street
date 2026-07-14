import boardJson from "../../../data/command/board-registry.json";
import {
  CAMPUS_TEAMS,
  getCampusPosition,
  listPositionsForTeam,
  type CampusTeamId,
} from "@/lib/college-community/catalog";
import { getCollegePosition } from "@/lib/meeting/positions-catalog";
import { listColleges } from "@/lib/college-community/institutions";

export type CommandLaneId = "social" | "events" | "registration" | "canvass" | "community";

export type CommandLane = {
  id: CommandLaneId;
  label: string;
  campaign_role: string;
  campus_team_id: string;
  meeting_position_id: string;
  signup_href: string;
  position_href: string;
  goal: string;
  under_events_board: boolean;
  board_owner?: string;
  supporting_campus_teams?: string[];
};

export type CommandGoal = {
  id: string;
  title: string;
  agenda_items: string[];
  owner_lane: CommandLaneId;
  explain: string;
};

export type CommandDrilldown = {
  slug: string;
  agenda_items: string[];
  title: string;
  summary: string;
  bullets: string[];
};

export const COMMAND_BOARD = boardJson as {
  version: string;
  updated: string;
  status: string;
  honesty: { working_now: string[]; still_being_completed: string[] };
  oversight: {
    campaign_manager: {
      role_key: string;
      display_name: string;
      person: string | null;
      status: string;
      scope: string;
      reports_to: string;
    };
    assistant_campaign_manager: {
      role_key: string;
      display_name: string;
      person: string | null;
      status: string;
      scope: string;
      reports_to: string;
    };
    volunteer_manager: {
      role_key: string;
      display_name: string;
      person: string;
      status: string;
      scope: string;
      reports_to: string;
      owns: string[];
    };
  };
  lanes: CommandLane[];
  goals: CommandGoal[];
  drilldowns: CommandDrilldown[];
};

export function listCommandLanes(): CommandLane[] {
  return COMMAND_BOARD.lanes;
}

export function getCommandLane(id: string): CommandLane | null {
  return COMMAND_BOARD.lanes.find((l) => l.id === id) ?? null;
}

export function listCommandGoals(): CommandGoal[] {
  return COMMAND_BOARD.goals;
}

export function getDrilldown(slug: string): CommandDrilldown | null {
  return COMMAND_BOARD.drilldowns.find((d) => d.slug === slug) ?? null;
}

export function getDrilldownForAgendaItem(itemNumber: string): CommandDrilldown | null {
  return COMMAND_BOARD.drilldowns.find((d) => d.agenda_items.includes(itemNumber)) ?? null;
}

export function laneHref(laneId: string, side: "campaign" | "campus", collegeSlug?: string): string {
  if (side === "campaign") return `/command/campaign/${laneId}`;
  if (!collegeSlug) return `/command/campus`;
  return `/command/campus/${collegeSlug}/${laneId}`;
}

export function buildLaneBoard(laneId: string, collegeSlug?: string) {
  const lane = getCommandLane(laneId);
  if (!lane) return null;
  const meeting = getCollegePosition(lane.meeting_position_id);
  const team = CAMPUS_TEAMS.find((t) => t.id === lane.campus_team_id);
  const campusPositions = listPositionsForTeam(lane.campus_team_id as CampusTeamId);
  const supporting =
    lane.supporting_campus_teams?.map((id) => CAMPUS_TEAMS.find((t) => t.id === id)).filter(Boolean) ?? [];
  const college = collegeSlug ? listColleges().find((c) => c.slug === collegeSlug) : null;

  return {
    lane,
    meeting,
    team,
    campusPositions,
    supporting,
    college,
    oversight: COMMAND_BOARD.oversight,
    campaignHref: `/command/campaign/${lane.id}`,
    campusHref: collegeSlug ? `/command/campus/${collegeSlug}/${lane.id}` : `/command/campus`,
    eventsBoardHref: lane.under_events_board ? "/command/events" : null,
    honesty: COMMAND_BOARD.honesty,
  };
}

export function buildEventsBoard() {
  const lane = getCommandLane("events")!;
  const meeting = getCollegePosition(lane.meeting_position_id);
  return {
    owner: COMMAND_BOARD.oversight.volunteer_manager,
    lane,
    meeting,
    campaignHref: `/command/campaign/events`,
    campusTeamHref: (slug: string) => `/college/${slug}/teams/social-events`,
    signupHref: lane.signup_href,
    honesty: COMMAND_BOARD.honesty,
  };
}

export function buildManagersBoard() {
  return {
    campaign_manager: COMMAND_BOARD.oversight.campaign_manager,
    assistant_campaign_manager: COMMAND_BOARD.oversight.assistant_campaign_manager,
    volunteer_manager: COMMAND_BOARD.oversight.volunteer_manager,
    lanes: COMMAND_BOARD.lanes,
    honesty: COMMAND_BOARD.honesty,
  };
}

export function listCampusCommandLinks() {
  return listColleges().map((c) => ({
    slug: c.slug,
    name: c.name,
    href: `/command/campus/${c.slug}`,
    collegeHref: `/college/${c.slug}`,
  }));
}

/** Soft-beta job cards used by hub and sandbox. */
export function listJobSignupLinks() {
  return COMMAND_BOARD.lanes.map((lane) => ({
    laneId: lane.id,
    label: lane.label,
    positionTitle: getCollegePosition(lane.meeting_position_id)?.title ?? lane.meeting_position_id,
    positionHref: lane.position_href,
    signupHref: lane.signup_href,
  }));
}

export function campusLeadForLane(laneId: string) {
  const lane = getCommandLane(laneId);
  if (!lane) return null;
  const leads = listPositionsForTeam(lane.campus_team_id as CampusTeamId).filter((p) => p.kind === "leadership");
  return leads[0] ?? getCampusPosition(`${lane.campus_team_id}-lead`) ?? null;
}
