import { notFound } from "next/navigation";
import {
  assembleWorkstreamBoard,
  DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT,
} from "@/lib/civic-action/builds/11.2/ux";

export default async function WorkstreamBoardPage({
  params,
}: {
  params: Promise<{ id: string; objectiveId: string }>;
}) {
  const { id, objectiveId } = await params;
  const board = assembleWorkstreamBoard(id, objectiveId, DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT);

  if (board.empty_state) {
    return (
      <div className="card text-center">
        <h1 className="text-xl font-bold">{board.empty_state.title}</h1>
        <p className="mt-2 text-slate-600">{board.empty_state.body}</p>
        <p className="mt-4 text-sm font-semibold text-orange-800">{board.empty_state.action_label}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Workstream Board</h1>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {board.columns.map((col) => (
          <div key={col.column} className="min-w-[240px] flex-shrink-0 rounded-lg bg-slate-100 p-3">
            <h2 className="font-semibold text-slate-800">{col.label}</h2>
            <ul className="mt-3 space-y-2">
              {col.cards.length === 0 ? (
                <li className="text-xs text-slate-500">—</li>
              ) : (
                col.cards.map((card) => (
                  <li key={card.workstream_id} className="rounded bg-white p-3 shadow-sm">
                    <p className="font-medium text-slate-900">{card.title}</p>
                    <p className="mt-1 text-xs text-slate-600">{card.purpose}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      {card.mission_count} missions · {card.owner_label}
                    </p>
                    {card.blocker_summary && (
                      <p className="mt-1 text-xs text-amber-800">{card.blocker_summary}</p>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
