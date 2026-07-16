import { buildVolunteerCommandDashboard } from "@/lib/volunteer-command/dashboard";
import { VolunteerCommandWorkbench } from "@/components/volunteer-command/VolunteerCommandWorkbench";
import { requireAdminPageAccess } from "@/lib/admin/guard";

export const metadata = {
  title: "Volunteer Command — ASYON",
  description: "Statewide personnel, leadership, placement, and readiness",
};

export default async function VolunteerCommandPage() {
  await requireAdminPageAccess();
  const dashboard = buildVolunteerCommandDashboard({ section: "command" });
  return <VolunteerCommandWorkbench dashboard={dashboard} />;
}
