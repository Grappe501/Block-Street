import { notFound } from "next/navigation";
import { CollegeChrome } from "@/components/college-community/CollegeChrome";
import { TeamDetailBody } from "@/components/college-community/TeamDetailBody";
import { getCampusTeam } from "@/lib/college-community/catalog";
import { requireCollege } from "@/lib/college-community/page-helpers";

export default async function Page({ params }: { params: Promise<{ collegeSlug: string; teamId: string }> }) {
  const { collegeSlug, teamId } = await params;
  const college = requireCollege(collegeSlug);
  const team = getCampusTeam(teamId);
  if (!team) notFound();
  return (
    <CollegeChrome slug={college.slug} name={college.name} title={team.name}>
      <TeamDetailBody team={team} slug={college.slug} />
    </CollegeChrome>
  );
}
