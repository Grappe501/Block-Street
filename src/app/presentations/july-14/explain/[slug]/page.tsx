import Link from "next/link";
import { notFound } from "next/navigation";
import { CommandChrome } from "@/components/command/CommandChrome";
import { COMMAND_BOARD, getDrilldown } from "@/lib/command/board";

export function generateStaticParams() {
  return COMMAND_BOARD.drilldowns.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = getDrilldown(slug);
  return { title: d ? `${d.title} · optional` : "Optional note" };
}

export default async function ExplainPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = getDrilldown(slug);
  if (!d) notFound();

  return (
    <CommandChrome
      title={d.title}
      subtitle={d.summary}
      backHref="/presentations/july-14"
      backLabel="Back to hub"
      eyebrow="Optional drill-down · keep it light"
    >
      <ul className="list-disc space-y-3 pl-5 font-fieldSans text-base leading-relaxed text-field-ink">
        {d.bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap gap-3">
        {d.agenda_items.map((item) => (
          <Link
            key={item}
            href={`/presentations/july-14/presenter?item=${item}`}
            className="rounded-lg bg-field-dusk px-4 py-2 font-fieldSans text-sm font-bold text-field-wheat"
          >
            Return to item {item}
          </Link>
        ))}
        <Link
          href="/presentations/july-14/goals"
          className="rounded-lg border border-field-ink/20 px-4 py-2 font-fieldSans text-sm font-bold text-field-ink"
        >
          All goals
        </Link>
      </div>
    </CommandChrome>
  );
}
