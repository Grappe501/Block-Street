import Link from "next/link";
import { assembleCommunityWorkspace, type CommunityKind } from "@/lib/community-workspace";
import { STATUS_COLORS, STATUS_LABELS, PLATFORM_DISCLAIMER } from "@/lib/data";
import { SignupButton } from "@/components/community/SignupButton";
import { CommunityPulse } from "./CommunityPulse";
import { CommunityGoals } from "./CommunityGoals";
import { PositionCards } from "./PositionCards";
import { SocialMeetupHub } from "./SocialMeetupHub";
import { FunctionalLanes } from "./FunctionalLanes";
import { PeopleDirectoryGate } from "./PeopleDirectoryGate";
import { CommitPlaceButton } from "@/components/launch/CommitPlaceButton";

type CommunityWorkspaceProps = {
  kind: CommunityKind;
  slug: string;
  backHref: string;
  backLabel: string;
  subtitle?: string;
  showGradientHeader?: boolean;
  children?: React.ReactNode;
};

export function CommunityWorkspace({
  kind,
  slug,
  backHref,
  backLabel,
  subtitle,
  showGradientHeader = false,
  children,
}: CommunityWorkspaceProps) {
  const workspace = assembleCommunityWorkspace(kind, slug);
  if (!workspace) return null;

  const header = showGradientHeader ? (
    <div
      className="py-12 text-white"
      style={{
        background: `linear-gradient(135deg, ${workspace.primaryColor} 0%, ${workspace.primaryColor}dd 100%)`,
      }}
    >
      <div className="mx-auto max-w-4xl px-4">
        <Link href={backHref} className="text-sm text-white/80 hover:text-white">
          {backLabel}
        </Link>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className={`badge ${STATUS_COLORS[workspace.representationStatus]}`}>
            {STATUS_LABELS[workspace.representationStatus]}
          </span>
          <span className="badge bg-white/20 text-white text-xs">
            Workspace {workspace.releaseVersion}
          </span>
          {workspace.openRoleCount > 0 && (
            <span className="badge bg-amber-400/30 text-white">
              {workspace.openRoleCount} open role{workspace.openRoleCount === 1 ? "" : "s"}
            </span>
          )}
        </div>
        <h1 className="mt-4 text-3xl font-bold md:text-4xl">{workspace.name}</h1>
        <p className="mt-2 text-lg text-white/90">
          {subtitle ?? `${workspace.countyName} · Our organizing workspace`}
        </p>
        {workspace.memberCount != null && (
          <p className="mt-2 text-sm text-white/75">
            {workspace.memberCount.toLocaleString()} confirmed participant
            {workspace.memberCount === 1 ? "" : "s"} · launch goal{" "}
            {workspace.participationMetrics.participation_goal}
          </p>
        )}
      </div>
    </div>
  ) : (
    <div className="mx-auto max-w-4xl px-4 pt-8">
      <Link href={backHref} className="text-sm text-brand-600 hover:underline">
        {backLabel}
      </Link>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className={`badge ${STATUS_COLORS[workspace.representationStatus]}`}>
          {STATUS_LABELS[workspace.representationStatus]}
        </span>
        <span className="badge bg-slate-100 text-slate-600 text-xs">Workspace {workspace.releaseVersion}</span>
      </div>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">{workspace.name}</h1>
      <p className="mt-2 text-slate-600">
        {subtitle ?? "County youth organizing workspace — ages 16–24"}
      </p>
    </div>
  );

  const body = (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <CommunityPulse items={workspace.pulse} />
      <CommunityGoals goals={workspace.goals} metrics={workspace.participationMetrics} />
      <PositionCards
        cards={workspace.positionCards}
        countySlug={workspace.countySlug}
        schoolSlug={workspace.signupSchool}
      />
      <SocialMeetupHub
        meetup={workspace.meetup}
        countySlug={workspace.countySlug}
        schoolSlug={workspace.signupSchool}
      />
      <FunctionalLanes lanes={workspace.lanes} />
      <CommitPlaceButton
        kind={
          workspace.kind === "county"
            ? "county"
            : workspace.kind === "high_school"
              ? "high-school"
              : workspace.kind === "private_charter"
                ? "private-school"
                : "school"
        }
        slug={slug}
        name={workspace.name}
        countySlug={workspace.countySlug}
      />
      <PeopleDirectoryGate workspace={workspace} />
      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Join Our Network</h2>
        <p className="mt-2 text-slate-600">
          Sign up with an invitation, get your share link, and help build {workspace.shortName}.
        </p>
        <SignupButton
          county={workspace.signupCounty}
          school={workspace.signupSchool}
          label={workspace.kind === "county" ? "Sign Up for County Hub" : "Sign Up"}
        />
      </div>
      {children}
      <p className="text-xs text-slate-400">{PLATFORM_DISCLAIMER}</p>
    </div>
  );

  return (
    <div>
      {header}
      {body}
    </div>
  );
}
