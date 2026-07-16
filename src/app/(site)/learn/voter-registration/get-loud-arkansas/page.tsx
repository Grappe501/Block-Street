import Link from "next/link";
import { GetLoudRegistrationResourceCard } from "@/components/civic-resources/GetLoudRegistrationResourceCard";
import { loadGetLoudEducation, projectGetLoudCard } from "@/lib/civic-resources/registry";

export const metadata = {
  title: "Get Loud Arkansas · Voter registration assistance",
  description: "Independent voter-registration assistance resource provided by Get Loud Arkansas.",
};

export default function GetLoudEducationPage() {
  const education = loadGetLoudEducation();
  const projection = projectGetLoudCard("standard");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Learn · Voter registration</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">Get Loud Arkansas</h1>
      <p className="mt-2 text-sm text-slate-600">{education.relationshipLabel}</p>

      <section id="what-is" className="mt-8 space-y-3">
        <h2 className="text-xl font-bold text-slate-900">What is Get Loud Arkansas?</h2>
        <p className="text-sm text-slate-700">{education.missionSummary}</p>
        <p className="text-sm text-slate-700">{education.historySummary}</p>
      </section>

      <section id="programs" className="mt-8">
        <h2 className="text-xl font-bold text-slate-900">What does Get Loud Arkansas do?</h2>
        <ul className="mt-3 space-y-2">
          {education.initiativeSummaries.map((item) => (
            <li key={item.key} className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
              <p className="font-semibold text-slate-900">{item.title}</p>
              <p className="text-slate-700">{item.summary}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="easy-application" className="mt-8 space-y-3">
        <h2 className="text-xl font-bold text-slate-900">What is the Easy Application?</h2>
        <p className="text-sm text-slate-700">
          The Easy Application is operated externally by Get Loud Arkansas. It assists with preparing Arkansas&apos;s paper
          voter-registration application. It is not an online voter-registration portal. County-clerk acceptance is required
          before you are registered.
        </p>
        <p className="text-sm text-slate-700">{education.registrationTool.postSubmissionGuidance}</p>
      </section>

      <section id="qr-flow" className="mt-8 space-y-3">
        <h2 className="text-xl font-bold text-slate-900">What happens when I scan the QR code?</h2>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-700">
          <li>Your phone opens the Get Loud Arkansas form on Jotform.</li>
          <li>You review Get Loud&apos;s explanation and privacy context.</li>
          <li>You complete the form directly with Get Loud.</li>
          <li>Block-Street does not receive your answers.</li>
          <li>You follow the instructions shown by Get Loud.</li>
          <li>You later confirm your registration with your county clerk or Arkansas VoterView.</li>
        </ol>
      </section>

      <section id="privacy" className="mt-8 space-y-3">
        <h2 className="text-xl font-bold text-slate-900">Privacy and responsibility</h2>
        <p className="whitespace-pre-line text-sm text-slate-700">{education.fullDisclosure}</p>
      </section>

      <section id="confirm" className="mt-8 space-y-3">
        <h2 className="text-xl font-bold text-slate-900">Confirm your registration</h2>
        <p className="text-sm text-slate-700">
          Submitting an application does not by itself confirm that you are registered. Check with your county clerk or{" "}
          <Link href={education.officialConfirmationResource.url} className="text-brand-700 underline" target="_blank" rel="noopener noreferrer">
            Arkansas VoterView
          </Link>
          .
        </p>
      </section>

      <section id="conversation-guide" className="mt-8 space-y-3">
        <h2 className="text-xl font-bold text-slate-900">Registration conversation guide</h2>
        <p className="text-sm text-slate-700">
          Would you like help finding a voter-registration application? Get Loud Arkansas offers an independent tool that
          helps prepare Arkansas&apos;s paper application. Block-Street does not operate the form or receive the information
          entered. After applying, confirm registration with your county clerk or Arkansas VoterView.
        </p>
      </section>

      <section id="college" className="mt-8 space-y-3">
        <h2 className="text-xl font-bold text-slate-900">College students</h2>
        <p className="text-sm text-slate-700">
          Block-Street does not make legal residency decisions. Direct students to official Arkansas guidance and their county
          clerk when uncertain.
        </p>
      </section>

      {projection && (
        <section className="mt-10">
          <GetLoudRegistrationResourceCard projection={projection} variant="standard" />
        </section>
      )}

      <section className="mt-8 text-sm">
        <Link href={education.organizationUrl} target="_blank" rel="noopener noreferrer" className="text-brand-700 underline">
          Learn more about Get Loud Arkansas
        </Link>
      </section>
    </div>
  );
}
