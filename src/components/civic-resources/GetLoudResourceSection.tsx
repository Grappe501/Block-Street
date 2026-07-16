import { GetLoudRegistrationResourceCard } from "@/components/civic-resources/GetLoudRegistrationResourceCard";
import { projectGetLoudCard } from "@/lib/civic-resources/registry";
import type { GetLoudCardVariant } from "@/lib/civic-resources/types";

type Props = {
  variant?: GetLoudCardVariant;
  locale?: "en" | "es";
  className?: string;
};

export function GetLoudResourceSection({ variant = "standard", locale = "en", className }: Props) {
  const projection = projectGetLoudCard(variant, locale);
  if (!projection) return null;
  return <GetLoudRegistrationResourceCard projection={projection} variant={variant} className={className} />;
}
