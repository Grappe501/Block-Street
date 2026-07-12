import Link from "next/link";
import {
  assembleInitiativePortfolio,
  DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT,
} from "@/lib/civic-action/builds/11.1/ux";
import { InitiativeCard } from "@/features/initiatives/components/InitiativeCard";
import { ExecutiveBriefCard } from "@/features/initiatives/components/ExecutiveBriefCard";

export default async function InitiativesPortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const params = await searchParams;
  const mode = params.mode ?? "institution";
  const portfolio = assembleInitiativePortfolio(DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT, mode);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">{portfolio.institution_name}</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Our Initiatives</h1>
          <p className="mt-2 text-slate-600">
            {portfolio.active_count} active · {portfolio.needs_attention_count} need attention · {portfolio.approvals_waiting} awaiting approval
          </p>
        </div>
        <Link href="/initiatives/new" className="btn-primary">
          Propose an Initiative
        </Link>
      </div>

      <div className="mt-8">
        <ExecutiveBriefCard />
      </div>

      <div className="mt-6 flex flex-wrap gap-2 text-sm">
        {["institution", "needs_attention", "active", "drafts"].map((m) => (
          <Link
            key={m}
            href={`/initiatives?mode=${m}`}
            className={`rounded-full px-3 py-1 ${mode === m ? "bg-orange-100 text-orange-900 font-semibold" : "bg-slate-100 text-slate-600"}`}
          >
            {m.replace(/_/g, " ")}
          </Link>
        ))}
      </div>

      {portfolio.empty_state ? (
        <div className="mt-10 card text-center">
          <h2 className="text-lg font-bold text-slate-900">{portfolio.empty_state.title}</h2>
          <p className="mt-2 text-slate-600">{portfolio.empty_state.body}</p>
          {portfolio.empty_state.action_href && (
            <Link href={portfolio.empty_state.action_href} className="btn-primary mt-4 inline-block">
              {portfolio.empty_state.action_label}
            </Link>
          )}
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {portfolio.cards.map((card) => (
            <InitiativeCard key={card.initiative_id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}
