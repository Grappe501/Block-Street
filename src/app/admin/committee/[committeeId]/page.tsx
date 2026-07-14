import Link from "next/link";
import { fieldPlanPlaceholderCopy } from "@/lib/volunteer-command/roles";
import { FieldManualNavTab } from "@/components/field-strategy/FieldManualNavTab";

export default async function AdminCommitteePage({
  params,
}: {
  params: Promise<{ committeeId: string }>;
}) {
  const { committeeId } = await params;
  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Committee board scaffold</p>
        <FieldManualNavTab variant="workspace" />
      </div>
      <h1 className="text-2xl font-bold text-slate-950">{decodeURIComponent(committeeId)}</h1>
      <p className="text-sm text-slate-700">
        Committee = all active leads + volunteers on the same position and scope. Co-leads allowed.
      </p>
      <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
        {fieldPlanPlaceholderCopy()}
      </p>
      <p className="text-xs text-slate-500">Persistence: derived / static scaffold — not Postgres.</p>
      <Link href="/admin/volunteer-command/committees" className="text-sm font-semibold text-brand-800 underline">
        ← Volunteer Command committees
      </Link>
    </div>
  );
}
