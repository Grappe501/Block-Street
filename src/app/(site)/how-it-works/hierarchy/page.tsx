import Link from "next/link";
import { MeetingChrome } from "@/components/meeting/MeetingChrome";
import { HonestyPanel } from "@/components/meeting/HonestyPanel";
import {
  HIERARCHY_CHAIN,
  HIERARCHY_CHILDREN,
  HIERARCHY_NODES,
  getHierarchyNode,
} from "@/lib/meeting/hierarchy";

export const metadata = {
  title: "Hierarchy — how it works",
};

export default function HierarchyPage() {
  return (
    <MeetingChrome
      title="Hierarchy"
      subtitle="Click a node to skim how it serves people. Soft beta shows structure without fabricating who holds each seat."
    >
      <p className="mb-4 text-sm">
        <Link href="/how-it-works" className="font-semibold text-brand-800 underline-offset-2 hover:underline">
          ← How it works
        </Link>
      </p>

      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {HIERARCHY_CHAIN.map((id, index) => {
          const node = getHierarchyNode(id)!;
          return (
            <li key={id} className="flex items-center gap-2">
              {index > 0 ? <span className="text-slate-400">→</span> : null}
              <a
                href={`#${id}`}
                className="rounded-md border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-900 hover:border-brand-300 hover:bg-brand-50"
              >
                {node.title}
              </a>
            </li>
          );
        })}
      </ol>

      <div className="mt-8 space-y-6">
        {HIERARCHY_NODES.map((node) => {
          const children = HIERARCHY_CHILDREN[node.id] ?? [];
          return (
            <section
              key={node.id}
              id={node.id}
              className="scroll-mt-24 rounded-lg border border-slate-200 bg-white p-4"
            >
              <h2 className="text-lg font-bold text-slate-950">{node.title}</h2>
              <p className="mt-2 text-sm text-slate-700">{node.purpose}</p>
              <p className="mt-2 text-sm text-slate-600">
                <span className="font-semibold text-slate-900">Serves:</span> {node.serves}
              </p>
              {node.reportsTo ? (
                <p className="mt-1 text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">Reports to:</span> {node.reportsTo}
                </p>
              ) : null}
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
                {node.responsibilities.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
              <div className="mt-4">
                <HonestyPanel
                  title={`${node.title} honesty`}
                  workingNow={[node.enabledToday, node.sees]}
                  stillCompleting={[node.pending]}
                />
              </div>
              {children.length > 0 ? (
                <p className="mt-3 text-xs text-slate-500">
                  Next:{" "}
                  {children.map((childId, i) => {
                    const child = getHierarchyNode(childId);
                    return (
                      <span key={childId}>
                        {i > 0 ? " · " : null}
                        <a
                          href={`#${childId}`}
                          className="font-semibold text-brand-800 underline-offset-2 hover:underline"
                        >
                          {child?.title ?? childId}
                        </a>
                      </span>
                    );
                  })}
                </p>
              ) : null}
            </section>
          );
        })}
      </div>
    </MeetingChrome>
  );
}
