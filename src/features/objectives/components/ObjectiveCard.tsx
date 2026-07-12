import Link from "next/link";
import type { ObjectiveCardView } from "@/lib/civic-action/builds/11.2/ux";

export function ObjectiveCard({ card }: { card: ObjectiveCardView }) {
  return (
    <Link href={card.href} className="card block transition hover:border-orange-300 hover:shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-slate-900">{card.display_name}</h3>
        <span className="text-xs font-medium text-slate-600">{card.health_label}</span>
      </div>
      <p className="mt-1 text-xs text-slate-500">{card.type_label}</p>
      <p className="mt-2 line-clamp-2 text-sm text-slate-600">{card.purpose_summary}</p>
      {card.progress_percent != null && (
        <p className="mt-3 text-sm font-semibold text-orange-800">{card.progress_percent}% progress</p>
      )}
    </Link>
  );
}
