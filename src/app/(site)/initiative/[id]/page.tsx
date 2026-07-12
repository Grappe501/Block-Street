import { redirect } from "next/navigation";

export default async function LegacyInitiativeRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/initiatives/${id}`);
}
