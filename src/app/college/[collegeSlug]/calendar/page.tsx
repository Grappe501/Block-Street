import { redirect } from "next/navigation";
import { collegeStaticParams } from "@/lib/college-community/page-helpers";

export function generateStaticParams() {
  return collegeStaticParams();
}

export default async function CollegeCalendarIndexPage({ params }: { params: Promise<{ collegeSlug: string }> }) {
  const { collegeSlug } = await params;
  redirect(`/college/${collegeSlug}/calendar/month`);
}
