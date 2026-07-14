import { ManualNav } from "@/components/field-strategy/ManualNav";
import { LandingHero } from "@/components/field-strategy/LandingHero";

export default function FieldStrategyHomePage() {
  return (
    <>
      <ManualNav active="overview" />
      <LandingHero />
    </>
  );
}
