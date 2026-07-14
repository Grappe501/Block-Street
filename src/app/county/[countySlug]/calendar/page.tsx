import { notFound, redirect } from "next/navigation";
import { getCounties } from "@/lib/data";

export function generateStaticParams() {
  return getCounties().map((c) => ({ countySlug: c.slug }));
}

export default async function CountyCalendarIndexPage({ params }: { params: Promise<{ countySlug: string }> }) {
  const { countySlug } = await params;
  if (!getCounties().find((c) => c.slug === countySlug)) notFound();
  redirect(`/county/${countySlug}/calendar/month`);
}
