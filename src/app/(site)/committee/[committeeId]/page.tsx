import { redirect } from "next/navigation";

export default async function CommitteeAliasPage({
  params,
}: {
  params: Promise<{ committeeId: string }>;
}) {
  const { committeeId } = await params;
  redirect(`/admin/committee/${encodeURIComponent(committeeId)}`);
}
