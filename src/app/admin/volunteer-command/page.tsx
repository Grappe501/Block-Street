import { buildVolunteerCommandDashboard } from "@/lib/volunteer-command/dashboard";
import { VolunteerCommandWorkbench } from "@/components/volunteer-command/VolunteerCommandWorkbench";

export const metadata = {
  title: "Volunteer Command — ASYON",
  description: "Statewide personnel, leadership, placement, and readiness",
};

export default function VolunteerCommandPage() {
  const dashboard = buildVolunteerCommandDashboard({ section: "command" });
  return <VolunteerCommandWorkbench dashboard={dashboard} />;
}
