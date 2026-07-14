import { CalendarChrome, CalendarHonestyBanner } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { ProposeEventForm } from "@/components/calendar/ProposeEventForm";
import { collegeStaticParams, requireCollege } from "@/lib/college-community/page-helpers";
import { proposeEvent } from "@/lib/calendar";

export function generateStaticParams() {
  return collegeStaticParams();
}

async function proposeAction(input: Parameters<typeof proposeEvent>[0]) {
  "use server";
  const event = proposeEvent(input);
  return { event_id: event.event_id };
}

export default async function CollegeCalendarProposePage({ params }: { params: Promise<{ collegeSlug: string }> }) {
  const { collegeSlug } = await params;
  const college = requireCollege(collegeSlug);

  return (
    <CalendarChrome
      title={`Propose event — ${college.name}`}
      subtitle="College-scoped proposal."
      backHref={`/college/${college.slug}/calendar`}
      backLabel={college.shortName}
      nav={<CalendarNav base={`/college/${college.slug}`} variant="college" />}
    >
      <CalendarHonestyBanner />
      <ProposeEventForm
        action={proposeAction}
        defaults={{ college_slug: college.slug, scope: "college", city: college.city }}
      />
    </CalendarChrome>
  );
}
