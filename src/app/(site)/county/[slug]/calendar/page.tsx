import { notFound, redirect } from "next/navigation";
import { getCounties } from "@/lib/data";

export function generateStaticParams() {
  return getCounties().map((c) => ({ slug: c.slug }));
}

export default async function CountyCalendarIndexPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getCounties().find((c) => c.slug === slug)) notFound();
  redirect(`/county/${slug}/calendar/month`);
}
