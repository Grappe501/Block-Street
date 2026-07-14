import { buildCollegeCommandDashboard } from "@/lib/college-command/dashboard";
import { CollegeCommandWorkbench } from "@/components/college-command/CollegeCommandWorkbench";

export const metadata = {
  title: "College Leader Workbench — ASYON",
  description: "Statewide education organizing command",
};

export default function CollegeCommandPage() {
  const dashboard = buildCollegeCommandDashboard();
  return <CollegeCommandWorkbench dashboard={dashboard} />;
}
