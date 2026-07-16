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
import { InspectBanner } from "./InspectBanner";
import { FieldManualNavTab } from "@/components/field-strategy/FieldManualNavTab";

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
          <FieldManualNavTab variant="header" />
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
        <FieldManualNavTab variant="workspace" />
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
    <div
      className="relative"
      style={{
        background:
          "radial-gradient(1200px 400px at 10% -10%, rgba(13,148,136,0.08), transparent 55%), radial-gradient(900px 360px at 100% 0%, rgba(15,23,42,0.04), transparent 50%), #f8fafc",
      }}
    >
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        <CommunityPulse items={workspace.pulse} />
        <CommunityGoals
          goals={workspace.goals}
          metrics={workspace.participationMetrics}
          primaryColor={workspace.primaryColor}
          scopeKind={workspace.kind}
          goalAccountable={workspace.goalAccountable}
        />
        <PositionCards
          cards={workspace.positionCards}
          countySlug={workspace.countySlug}
          schoolSlug={workspace.signupSchool}
          primaryColor={workspace.primaryColor}
        />
        <SocialMeetupHub
          meetup={workspace.meetup}
          countySlug={workspace.countySlug}
          schoolSlug={workspace.signupSchool}
        />
        <FunctionalLanes lanes={workspace.lanes} primaryColor={workspace.primaryColor} />
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
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">Join our network</h2>
          <p className="mt-2 text-slate-700">
            Sign up with an invitation, get your share link, and help build {workspace.shortName}.
          </p>
          <SignupButton
            county={workspace.signupCounty}
            school={workspace.signupSchool}
            label={workspace.kind === "county" ? "Sign Up for County Hub" : "Sign Up"}
          />
        </div>
        {children}
        <p className="text-xs text-slate-500">{PLATFORM_DISCLAIMER}</p>
      </div>
    </div>
  );

  return (
    <div>
      <InspectBanner />
      {header}
      {body}
    </div>
  );
}
