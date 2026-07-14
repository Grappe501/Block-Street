import { notFound } from "next/navigation";
import { CollegeChrome } from "@/components/college-community/CollegeChrome";
import { PositionDetailBody } from "@/components/college-community/PositionDetailBody";
import { getCampusPosition } from "@/lib/college-community/catalog";
import { requireCollege } from "@/lib/college-community/page-helpers";

export default async function Page({ params }: { params: Promise<{ collegeSlug: string; positionId: string }> }) {
  const { collegeSlug, positionId } = await params;
  const college = requireCollege(collegeSlug);
  const position = getCampusPosition(positionId);
  if (!position) notFound();
  return (
    <CollegeChrome slug={college.slug} name={college.name} title={position.title}>
      <PositionDetailBody position={position} slug={college.slug} />
    </CollegeChrome>
  );
}
