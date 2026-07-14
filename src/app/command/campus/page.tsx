import { CommandCard, CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { listCampusCommandLinks } from "@/lib/command/board";

export const metadata = { title: "Campus command boards" };

export default function CampusCommandIndexPage() {
  const campuses = listCampusCommandLinks();

  return (
    <CommandChrome
      title="Campus boards"
      subtitle="Every college has independent pages. Lane leaders still connect to the matching campaign board. CM and ACM oversee both sides."
    >
      <CommandSection title={`Colleges (${campuses.length})`}>
        <div className="grid gap-2 sm:grid-cols-2">
          {campuses.map((c) => (
            <CommandCard
              key={c.slug}
              href={c.href}
              title={c.name}
              note="Campus lanes · linked to campaign boards"
            />
          ))}
        </div>
      </CommandSection>
    </CommandChrome>
  );
}
