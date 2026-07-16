import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";

export const metadata = { title: "Outreach Command — Block Street" };

const FUNNEL = [
  "Prospects",
  "Contacted",
  "Responded",
  "Interested",
  "Onboarding",
  "Awaiting placement",
  "Placed",
  "Activated",
  "Inactive",
  "Re-engagement",
] as const;

export default function OutreachCommandPage() {
  return (
    <CommandChrome
      title="Outreach Command"
      subtitle="Owns direct contact, onboarding, and non-social campaign communications through placement handoff."
    >
      <CommandSection title="Recruitment funnel">
        <div className="flex flex-wrap gap-2">
          {FUNNEL.map((stage) => (
            <span key={stage} className="rounded-full border border-field-ink/15 bg-white px-3 py-1 text-xs font-medium text-field-ink">
              {stage}
            </span>
          ))}
        </div>
        <p className="mt-3 font-fieldSans text-sm text-field-ink/70">
          Wave 3 ships live counts from <code>RecruitmentRecord</code> and onboarding state. Outreach confirms placement before Volunteer Manager assigns committee authority.
        </p>
      </CommandSection>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <CommandSection title="Onboarding queue">
          <ul className="list-disc space-y-1 pl-5 font-fieldSans text-sm text-field-ink/80">
            <li>New recruits waiting for Outreach review</li>
            <li>Suggested lane + stated interests</li>
            <li>Follow-up due and escalation</li>
          </ul>
          <Link href="/home" className="mt-3 inline-block text-sm font-semibold text-brand-700 underline">
            Volunteer home (recruit view)
          </Link>
        </CommandSection>

        <CommandSection title="Retention alerts">
          <ul className="list-disc space-y-1 pl-5 font-fieldSans text-sm text-field-ink/80">
            <li>No first task</li>
            <li>Missed first meeting</li>
            <li>No activity in seven days</li>
            <li>Re-engagement recommended</li>
          </ul>
        </CommandSection>
      </div>

      <CommandSection title="Responsibility boundary">
        <table className="mt-2 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-field-ink/10 text-xs uppercase tracking-wide text-field-ink/60">
              <th className="py-2 pr-4">Stage</th>
              <th className="py-2">Owner</th>
            </tr>
          </thead>
          <tbody className="text-field-ink/85">
            <tr className="border-b border-field-ink/5"><td className="py-2 pr-4">Recruit → onboarding</td><td>Outreach</td></tr>
            <tr className="border-b border-field-ink/5"><td className="py-2 pr-4">Placement recommendation</td><td>Outreach</td></tr>
            <tr className="border-b border-field-ink/5"><td className="py-2 pr-4">Final volunteer placement</td><td>Volunteer Manager</td></tr>
            <tr><td className="py-2 pr-4">Social publishing</td><td>Social Media Manager</td></tr>
          </tbody>
        </table>
      </CommandSection>
    </CommandChrome>
  );
}
