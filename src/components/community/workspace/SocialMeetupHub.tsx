import Link from "next/link";
import { buildSignupHref } from "@/lib/data";
import type { SocialMeetup } from "@/lib/community-workspace";

export function SocialMeetupHub({
  meetup,
  countySlug,
  schoolSlug,
}: {
  meetup: SocialMeetup;
  countySlug: string;
  schoolSlug?: string;
}) {
  const isScheduled = meetup.status === "scheduled" && meetup.when;

  return (
    <section className="card border-violet-200 bg-gradient-to-br from-white to-violet-50/50">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Social Meetups</h2>
          <p className="mt-1 text-sm text-violet-900/80">
            In-person gatherings are how we build trust and grow our network.
          </p>
        </div>
        <span className={`badge ${isScheduled ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
          {isScheduled ? "Scheduled" : "Needs Social Lead"}
        </span>
      </div>

      <div className="mt-4 rounded-lg border border-violet-100 bg-white p-4">
        <h3 className="font-semibold text-slate-900">{meetup.title}</h3>
        <p className="mt-1 text-sm text-slate-600">{meetup.theme}</p>
        {isScheduled && meetup.when && (
          <p className="mt-2 text-sm font-medium text-slate-800">
            {new Date(meetup.when).toLocaleString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        )}
        <p className="mt-1 text-sm text-slate-500">{meetup.wherePublic}</p>
        {meetup.rhythm && (
          <p className="mt-2 text-xs font-medium text-violet-800">Rhythm: {meetup.rhythm}</p>
        )}
        {typeof meetup.rsvpCount === "number" && (
          <p className="mt-2 text-xs text-slate-500">{meetup.rsvpCount} RSVPs (members)</p>
        )}
      </div>

      {!isScheduled && (
        <Link
          href={`${buildSignupHref({ county: countySlug, school: schoolSlug })}&role=social_lead`}
          className="btn-primary mt-4 inline-block"
        >
          Volunteer as Social Lead
        </Link>
      )}
    </section>
  );
}
