import Link from "next/link";
import { notFound } from "next/navigation";
import { getJuly14Item, getJuly14Neighbors, JULY14_AGENDA_REGISTRY } from "@/lib/presentations/july14-registry";

export function generateStaticParams() {
  return JULY14_AGENDA_REGISTRY.items.flatMap((item) => [
    { item: item.item_number },
    ...item.aliases.map((a) => ({ item: a })),
  ]);
}

export default async function July14ItemPage({
  params,
  searchParams,
}: {
  params: Promise<{ item: string }>;
  searchParams: Promise<{ mode?: string }>;
}) {
  const { item: raw } = await params;
  const { mode: modeRaw } = await searchParams;
  const item = getJuly14Item(raw);
  if (!item) notFound();
  const { prev, next } = getJuly14Neighbors(item.item_number);
  const mode = modeRaw === "presenter" || modeRaw === "participant" ? modeRaw : "participant";
  const returnHref =
    mode === "presenter"
      ? `/presentations/july-14/presenter?item=${item.item_number}`
      : `/presentations/july-14/participant?item=${item.item_number}`;
  const drill = `${item.drill_down_route}${item.drill_down_route.includes("?") ? "&" : "?"}from=july14&item=${item.item_number}&mode=${mode}`;

  return (
    <div className="min-h-screen bg-field-dusk text-field-mist">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Link href={returnHref} className="font-fieldSans text-xs font-semibold text-field-wheat">
          ← Return to agenda item {item.item_number}
        </Link>
        <p className="mt-6 font-fieldSans text-[11px] font-semibold uppercase tracking-[0.18em] text-field-wheat">
          Agenda item {item.item_number}
          {item.item_number === "34" ? " · alias 034" : ""} · {item.duration_minutes} min · status {item.status}
        </p>
        <h1 className="mt-3 font-fieldDisplay text-3xl text-white sm:text-4xl">{item.title}</h1>

        <section className="mt-8 space-y-4 font-fieldSans text-sm leading-relaxed text-field-mist/90 sm:text-base">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wide text-field-wheat">Exact agenda language</h2>
            {item.participant_content.map((p) => (
              <p key={p} className="mt-2">
                {p}
              </p>
            ))}
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wide text-field-wheat">Why this is on tonight’s agenda</h2>
            <p className="mt-2">
              This leaf is part of the canonical July 14 College Team meeting flow frozen from Identity agenda language and
              the presentation twin. It keeps the room oriented toward understanding, choosing a way to serve, and taking a
              concrete next step.
            </p>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wide text-field-wheat">What we need to decide, understand, or do</h2>
            <p className="mt-2">{item.primary_action}</p>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wide text-field-wheat">Supporting Block Street module</h2>
            <p className="mt-2">
              <Link href={drill} className="font-semibold text-field-wheat underline">
                {item.drill_down_route}
              </Link>
            </p>
            <p className="mt-1 text-xs text-field-mist/60">Module family {item.family} · source {item.source_reference}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-emerald-500/30 bg-black/20 p-3">
              <p className="text-xs font-bold text-emerald-300">Operational today</p>
              <p className="mt-1 text-xs text-field-mist/80">
                Soft-beta exploration, presentation navigation, and linked modules marked live/partial. Invite-chain remains
                PRESENT, not CERTIFIED.
              </p>
            </div>
            <div className="rounded-lg border border-amber-500/30 bg-black/20 p-3">
              <p className="text-xs font-bold text-amber-300">Still pending</p>
              <p className="mt-1 text-xs text-field-mist/80">
                Certified invite binding, Postgres/RBAC, complete command boards, and L4 execution are outside tonight’s claims.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-8 flex flex-wrap gap-2">
          <Link href={drill} className="rounded-lg bg-field-wheat px-4 py-2.5 text-sm font-bold text-field-dusk">
            {item.primary_action} →
          </Link>
          <Link href={returnHref} className="rounded-lg border border-white/25 px-4 py-2.5 text-sm font-semibold">
            Return to item {item.item_number}
          </Link>
          {next ? (
            <Link
              href={
                mode === "presenter"
                  ? `/presentations/july-14/presenter?item=${next.item_number}`
                  : `/presentations/july-14/participant?item=${next.item_number}`
              }
              className="rounded-lg border border-white/25 px-4 py-2.5 text-sm font-semibold"
            >
              Continue to item {next.item_number}
            </Link>
          ) : null}
          {prev ? (
            <Link
              href={
                mode === "presenter"
                  ? `/presentations/july-14/presenter?item=${prev.item_number}`
                  : `/presentations/july-14/participant?item=${prev.item_number}`
              }
              className="rounded-lg border border-white/25 px-4 py-2.5 text-sm font-semibold"
            >
              Previous item {prev.item_number}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
