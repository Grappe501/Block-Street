import Link from "next/link";
import { CommandCard, CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { buildEventsBoard, listCampusCommandLinks } from "@/lib/command/board";

export const metadata = { title: "Event Board · Carol Eagan" };

export default function EventsBoardPage() {
  const board = buildEventsBoard();
  const campuses = listCampusCommandLinks().slice(0, 12);

  return (
    <CommandChrome
      title="Event Board"
      subtitle={`Owned by Volunteer Manager ${board.owner.person}. Campus Event / Social-Events leads connect here on the events lane. Campaign Manager and Assistant still oversee the lane.`}
      eyebrow="Volunteer Manager · events"
    >
      <div className="rounded-xl bg-field-dusk p-5 text-field-mist">
        <p className="font-fieldSans text-xs font-semibold uppercase tracking-[0.14em] text-field-wheat">Owner</p>
        <p className="mt-1 font-fieldDisplay text-3xl text-white">{board.owner.person}</p>
        <p className="mt-2 font-fieldSans text-sm text-field-mist/90">{board.owner.display_name}</p>
      </div>

      <CommandSection title="What this board is for">
        <ul className="list-disc space-y-2 pl-5 font-fieldSans text-sm text-field-ink/85">
          <li>Statewide rhythm for campus networking and recruitment events</li>
          <li>Same-lane connection between campaign Event Lead and campus Social & Events Team</li>
          <li>Clear signup path for the College Team Event Lead seat</li>
        </ul>
      </CommandSection>

      <CommandSection title="Actions">
        <div className="grid gap-3 sm:grid-cols-2">
          <CommandCard href={board.campaignHref} title="Campaign events lane" note="Statewide events board" accent />
          <CommandCard href={board.signupHref} title="Sign up — Event Lead" note="Interest form (soft beta)" />
          <CommandCard href={board.lane.position_href} title="Event Lead role page" note={board.meeting?.primaryContribution} />
          <CommandCard href="/command/managers" title="CM / ACM oversight" note="Managers over both sides" />
        </div>
      </CommandSection>

      <CommandSection title="Campus Social & Events (sample)">
        <p className="mb-3 font-fieldSans text-sm text-field-ink/70">
          Every campus has its own page. Open a college, then Social & Events — that lead still connects to this campaign events board.
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {campuses.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/college/${c.slug}/teams/social-events`}
                className="block rounded-lg border border-field-ink/15 bg-white px-3 py-2 font-fieldSans text-sm font-semibold text-field-ink hover:border-field-pine/50"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-3">
          <Link href="/command/campus" className="font-fieldSans text-sm font-semibold text-field-pine underline">
            Browse all campus boards →
          </Link>
        </p>
      </CommandSection>
    </CommandChrome>
  );
}
