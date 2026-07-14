import { buildLeaderDashboard } from "@/lib/volunteer-command/dashboard";
import { LeaderDashboardShell } from "@/components/volunteer-command/LeaderDashboardShell";

export default async function AdminLeaderDashboardPage({
  params,
}: {
  params: Promise<{ leadershipAssignmentId: string }>;
}) {
  const { leadershipAssignmentId } = await params;
  const dashboard = buildLeaderDashboard(leadershipAssignmentId);
  return <LeaderDashboardShell dashboard={dashboard} admin />;
}
