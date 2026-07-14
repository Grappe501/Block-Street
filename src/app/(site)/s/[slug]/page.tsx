import { getPublicShareCard, hydrateNetworkStore, REFERRAL_COOKIE } from "@/lib/network";
import { notFound } from "next/navigation";
import { RedirectShareClient } from "./ShareClient";

type Props = { params: Promise<{ slug: string }> };

export default async function PersonalSharePage({ params }: Props) {
  await hydrateNetworkStore();
  const { slug } = await params;
  const card = getPublicShareCard(slug);
  if (!card) notFound();

  return <RedirectShareClient card={card} referralCookie={REFERRAL_COOKIE} />;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  await hydrateNetworkStore();
  const card = getPublicShareCard(slug);
  return {
    title: card ? `Join ${card.preferred_name} on ASYON` : "Join ASYON",
  };
}
