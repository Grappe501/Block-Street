import Link from "next/link";
import { MeetingChrome, MeetingLinkList } from "@/components/meeting/MeetingChrome";
import { HonestyPanel } from "@/components/meeting/HonestyPanel";

export const metadata = {
  title: "Field Plan library — soft beta",
};

export default async function FieldPlanLibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ item?: string; mode?: string; from?: string }>;
}) {
  const sp = await searchParams;
  const fromItem = sp.item;
  const mode = sp.mode ?? (sp.from === "july14" ? "july14" : undefined);

  return (
    <MeetingChrome
      title="Field Plan library"
      subtitle="A soft wrapper around approved Field Plan depth concepts. We do not invent doctrine here — browse what’s present and what’s still awaiting ingest."
      eyebrow="Soft beta · Field Plan"
      fromItem={fromItem}
      mode={mode}
    >
      <MeetingLinkList
        items={[
          { href: "/field-plan/overview", label: "Overview", note: "What this library is for" },
          { href: "/field-plan/depths", label: "Depths L0–L4", note: "L4 blocked until durability + invite certification" },
          { href: "/field-plan/positions", label: "Positions", note: "Link into the soft-beta seat catalog" },
          { href: "/field-plan/responsibilities", label: "Responsibilities", note: "Approved library / Field Strategy" },
          { href: "/field-plan/tasks", label: "Tasks", note: "Awaiting scaffolds" },
          { href: "/field-plan/kpis", label: "KPIs", note: "College Command honesty + enrollment share" },
        ]}
      />
      <p className="mt-6 text-sm text-slate-600">
        Approved narrative manual:{" "}
        <Link href="/field-strategy" className="font-semibold text-brand-800 underline-offset-2 hover:underline">
          Field Strategy
        </Link>
      </p>
      <div className="mt-8">
        <HonestyPanel
          workingNow={["L0–L1 present concepts", "L2 Benton skeleton noted in docs", "Soft-beta position catalog links"]}
          stillCompleting={["L3 packs", "L4 execution loop (blocked)", "Broad approved ingest"]}
        />
      </div>
    </MeetingChrome>
  );
}
