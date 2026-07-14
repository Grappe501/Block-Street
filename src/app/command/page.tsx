import Link from "next/link";
import { CommandCard, CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import {
  COMMAND_BOARD,
  listCommandLanes,
  listJobSignupLinks,
} from "@/lib/command/board";

export const metadata = { title: "Command boards · soft beta" };

export default function CommandHubPage() {
  const lanes = listCommandLanes();
  const jobs = listJobSignupLinks();
  const vm = COMMAND_BOARD.oversight.volunteer_manager;
  const cm = COMMAND_BOARD.oversight.campaign_manager;
  const acm = COMMAND_BOARD.oversight.assistant_campaign_manager;

  return (
    <CommandChrome
      title="Campaign & campus command"
      subtitle="Campaign Manager and Assistant Campaign Manager oversee both sides. Each campus keeps its own pages. Same-lane leaders connect to the matching campaign board. Event Board sits under Volunteer Manager Carol Eagan."
      backHref="/presentations/july-14"
      backLabel="July 14 hub"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <CommandCard
          href="/command/managers"
          accent
          title="Campaign Manager & Assistant"
          note={`${cm.status === "open" ? "CM open" : cm.person} · ${acm.status === "open" ? "ACM open" : acm.person} · oversee both boards`}
        />
        <CommandCard
          href="/command/events"
          accent
          title="Event Board"
          note={`Owned by ${vm.display_name}: ${vm.person}`}
        />
        <CommandCard href="/command/campaign" title="Campaign lane boards" note="Statewide functional lanes" />
        <CommandCard href="/command/campus" title="Campus boards" note="Independent college pages, same-lane bridge" />
        <CommandCard href="/presentations/july-14/goals" title="Goals broken out" note="Section 4 goals with owners" />
        <CommandCard href="/positions/college" title="Sign up for jobs" note="College Team seats → interest form" />
      </div>

      <CommandSection title="Lanes (campaign ↔ campus)">
        <div className="grid gap-3">
          {lanes.map((lane) => (
            <div
              key={lane.id}
              className="rounded-xl border border-field-ink/15 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-fieldSans text-sm font-bold text-field-ink">{lane.label}</p>
                  <p className="mt-1 font-fieldSans text-sm text-field-ink/75">{lane.goal}</p>
                  {lane.under_events_board ? (
                    <p className="mt-2 font-fieldSans text-xs font-semibold text-field-pine">
                      Under Event Board · {lane.board_owner}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/command/campaign/${lane.id}`}
                    className="rounded-lg bg-field-dusk px-3 py-1.5 font-fieldSans text-xs font-bold text-field-wheat"
                  >
                    Campaign board
                  </Link>
                  <Link
                    href={lane.signup_href}
                    className="rounded-lg border border-field-ink/20 px-3 py-1.5 font-fieldSans text-xs font-bold text-field-ink"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CommandSection>

      <CommandSection title="Job signups">
        <ul className="divide-y divide-field-ink/10 rounded-xl border border-field-ink/15 bg-white">
          {jobs.map((job) => (
            <li key={job.laneId} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
              <div>
                <p className="font-fieldSans text-sm font-bold text-field-ink">{job.positionTitle}</p>
                <p className="font-fieldSans text-xs text-field-ink/65">{job.label} lane</p>
              </div>
              <div className="flex gap-2">
                <Link href={job.positionHref} className="font-fieldSans text-xs font-semibold text-field-pine underline">
                  Role page
                </Link>
                <Link href={job.signupHref} className="font-fieldSans text-xs font-semibold text-field-pine underline">
                  Express interest
                </Link>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-2 font-fieldSans text-xs text-field-ink/60">Interest ≠ appointment. Soft-beta local save until personnel persistence ships.</p>
      </CommandSection>
    </CommandChrome>
  );
}
