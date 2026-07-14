import { redirect, notFound } from "next/navigation";
import { getCollegePosition } from "@/lib/meeting/positions-catalog";

export default async function PositionFirst7Redirect({
  params,
}: {
  params: Promise<{ positionId: string }>;
}) {
  const { positionId } = await params;
  if (!getCollegePosition(positionId)) notFound();
  redirect(`/positions/${positionId}#first-7-days`);
}
