import Link from "next/link";
import type { InitiativeCardView } from "@/lib/civic-action/builds/11.1/ux";

export function InitiativeCard({ card }: { card: InitiativeCardView }) {
  return (
    <Link href={card.href} className="card block transition hover:border-orange-300 hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-slate-900">{card.name}</h3>
          <p className="text-xs text-slate-500">{card.type_label} · {card.status_label}</p>
        </div>
        <span className="badge bg-slate-100 text-slate-700 text-xs">{card.viewer_role.replace(/_/g, " ")}</span>
      </div>
      <p className="mt-2 text-sm text-slate-600 line-clamp-2">{card.purpose_summary}</p>
      <div className="mt-3 grid gap-1 text-xs text-slate-500">
        <p>Operational Owner: <span className="font-medium text-slate-800">{card.operational_owner_label}</span></p>
        {card.attention_item && (
          <p className="font-medium text-amber-800">Needs attention: {card.attention_item}</p>
        )}
      </div>
    </Link>
  );
}
