import Link from "next/link";
import { notFound } from "next/navigation";
import { CommandCard, CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { listCommandLanes } from "@/lib/command/board";
import { getCollege } from "@/lib/college-community/institutions";

export async function generateMetadata({ params }: { params: Promise<{ collegeSlug: string }> }) {
  const { collegeSlug } = await params;
  const college = getCollege(collegeSlug);
  return { title: college ? `${college.name} · campus command` : "Campus command" };
}

export default async function CampusCommandPage({ params }: { params: Promise<{ collegeSlug: string }> }) {
  const { collegeSlug } = await params;
  const college = getCollege(collegeSlug);
  if (!college) notFound();
  const lanes = listCommandLanes();

  return (
    <CommandChrome
      title={college.name}
      subtitle="Independent campus pages with same-lane bridges to the campaign boards. CM and ACM oversee both."
      backHref="/command/campus"
      backLabel="All campuses"
      eyebrow="Campus command · soft beta"
    >
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/college/${college.slug}`}
          className="rounded-lg bg-field-dusk px-3 py-2 font-fieldSans text-xs font-bold text-field-wheat"
        >
          College Community home
        </Link>
        <Link
          href={`/college/${college.slug}/positions`}
          className="rounded-lg border border-field-ink/20 px-3 py-2 font-fieldSans text-xs font-bold text-field-ink"
        >
          Campus positions
        </Link>
        <Link
          href={`/college/${college.slug}/teams/social-events`}
          className="rounded-lg border border-field-ink/20 px-3 py-2 font-fieldSans text-xs font-bold text-field-ink"
        >
          Social & Events team
        </Link>
      </div>

      <CommandSection title="Lanes on this campus">
        <div className="grid gap-3">
          {lanes.map((lane) => (
            <CommandCard
              key={lane.id}
              href={`/command/campus/${college.slug}/${lane.id}`}
              title={lane.label}
              note={
                lane.under_events_board
                  ? `Connects to Event Board (Carol Eagan) · campaign /command/campaign/${lane.id}`
                  : `Same-lane campaign board · /command/campaign/${lane.id}`
              }
              accent={lane.under_events_board}
            />
          ))}
        </div>
      </CommandSection>
    </CommandChrome>
  );
}
