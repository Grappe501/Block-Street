import { CommandCard, CommandSection } from "@/components/command/CommandChrome";
import { EventOperationsChrome } from "@/components/calendar/operations/EventOperationsChrome";
import { TemplateCard } from "@/components/calendar/templates/TemplateCard";
import { listTemplates, TEMPLATE_CATALOG } from "@/lib/calendar/templates";

export const metadata = { title: "Event templates · Command" };

export default function CommandTemplatesPage() {
  const active = listTemplates({ status: "active" });
  const college = active.filter((t) => t.recommendedFor.college);
  const county = active.filter((t) => t.recommendedFor.county);
  const candidate = active.filter((t) => t.defaults.candidateAttendance !== "not_applicable");
  const flagship = active.filter((t) => t.tags.includes("flagship"));

  return (
    <EventOperationsChrome title="Event templates" subtitle="Template library command view — defaults, not commands." backHref="/command/events" backLabel="Event Operations">
      <CommandSection title={`${TEMPLATE_CATALOG.length} templates (${active.length} active)`}>
        <div className="grid gap-3 sm:grid-cols-2">
          {active.slice(0, 6).map((t) => (
            <TemplateCard key={t.templateId} template={t} />
          ))}
        </div>
      </CommandSection>
      <CommandSection title="Scoped views">
        <div className="grid gap-2 sm:grid-cols-2 font-fieldSans text-sm">
          <CommandCard href="/calendar/templates" title="Full library" note={`${active.length} active templates`} />
          <p className="rounded-lg border bg-white p-3">College templates: {college.length}</p>
          <p className="rounded-lg border bg-white p-3">County templates: {county.length}</p>
          <p className="rounded-lg border bg-white p-3">Candidate templates: {candidate.length}</p>
          <p className="rounded-lg border bg-white p-3">Flagship: {flagship.length} {flagship.length >= 2 ? "PASS" : "check"}</p>
        </div>
      </CommandSection>
    </EventOperationsChrome>
  );
}
