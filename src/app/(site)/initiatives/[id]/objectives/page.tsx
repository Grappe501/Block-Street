import Link from "next/link";
import {
  assembleObjectivePortfolio,
  DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT,
} from "@/lib/civic-action/builds/11.2/ux";
import { ObjectiveCard } from "@/features/objectives/components/ObjectiveCard";

export default async function ObjectivesPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const portfolio = assembleObjectivePortfolio(id, DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Our Objectives</h1>
          <p className="mt-1 text-slate-600">
            {portfolio.active_count} active · {portfolio.needs_attention_count} need attention
          </p>
        </div>
        <Link href={`/initiatives/${id}/objectives/new`} className="btn-primary">
          Create Objective
        </Link>
      </div>

      {portfolio.empty_state ? (
        <div className="card border-dashed text-center">
          <h2 className="text-lg font-bold text-slate-900">{portfolio.empty_state.title}</h2>
          <p className="mt-2 text-slate-600">{portfolio.empty_state.body}</p>
          <Link href={portfolio.empty_state.action_href} className="btn-primary mt-4 inline-block">
            {portfolio.empty_state.action_label}
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {portfolio.cards.map((card) => (
            <ObjectiveCard key={card.objective_id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}
