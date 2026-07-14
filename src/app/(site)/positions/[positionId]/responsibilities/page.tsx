import { redirect } from "next/navigation";
import { getCollegePosition } from "@/lib/meeting/positions-catalog";
import { notFound } from "next/navigation";

export default async function PositionResponsibilitiesRedirect({
  params,
}: {
  params: Promise<{ positionId: string }>;
}) {
  const { positionId } = await params;
  if (!getCollegePosition(positionId)) notFound();
  redirect(`/positions/${positionId}#responsibilities`);
}
