import { buildCountyVolunteerCommand } from "@/lib/volunteer-command/dashboard";
import { CountyVolunteerCommandView } from "@/components/volunteer-command/CountyVolunteerCommand";

export default async function CountyVolunteerCommandPage({
  params,
}: {
  params: Promise<{ countySlug: string }>;
}) {
  const { countySlug } = await params;
  const dashboard = buildCountyVolunteerCommand(countySlug);
  return <CountyVolunteerCommandView dashboard={dashboard} />;
}
