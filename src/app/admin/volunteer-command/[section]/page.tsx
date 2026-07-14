import { notFound } from "next/navigation";
import { buildVolunteerCommandDashboard, type VolunteerCommandSection } from "@/lib/volunteer-command/dashboard";
import { VolunteerCommandWorkbench } from "@/components/volunteer-command/VolunteerCommandWorkbench";

const SECTIONS: VolunteerCommandSection[] = [
  "people",
  "leadership",
  "committees",
  "counties",
  "education",
  "functions",
  "intake",
  "orientation",
  "placement",
  "retention",
  "coverage",
  "reports",
  "risks",
];

export function generateStaticParams() {
  return SECTIONS.map((section) => ({ section }));
}

export default async function VolunteerCommandSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!SECTIONS.includes(section as VolunteerCommandSection)) notFound();
  const dashboard = buildVolunteerCommandDashboard({ section: section as VolunteerCommandSection });
  return <VolunteerCommandWorkbench dashboard={dashboard} />;
}
