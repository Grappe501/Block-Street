import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import certRegistry from "../../../../../data/v1-certification/product-certification-registry.json";
import featureDiscovery from "../../../../../data/registry/feature-discovery-registry.json";
import launchReadiness from "../../../../../data/launch-readiness.json";
import buildProgress from "../../../../../data/build-progress.json";

/** Authenticated mirror of Operator Command summary (Build Control UI loads registries client-side). */
export const GET = withAdmin(() => {
  const journeys = certRegistry.journeys ?? [];
  const pendingCert = journeys.filter((j) => j.status === "pending" || j.status === "not_started");
  const features = featureDiscovery.features ?? [];
  const byAudience: Record<string, number> = {};
  for (const f of features) {
    byAudience[f.audience] = (byAudience[f.audience] ?? 0) + 1;
  }
  const pendingFeatures = features.filter((f) => f.certification === "pending_cert");

  return NextResponse.json({
    doctrine: {
      hierarchy: ["Vision", "Product Truth", "Journey Certification", "Implementation", "Deployment"],
      launch: certRegistry.launchDoctrine,
      activeProgram: (buildProgress.project as { activeProgram?: string })?.activeProgram,
      productionCommit: (buildProgress.project as { productionCommit?: string })?.productionCommit,
      deployUrl: (buildProgress.project as { deployUrl?: string })?.deployUrl,
    },
    journeys,
    pendingCertCount: pendingCert.length,
    launchReadyNarrow: Boolean(launchReadiness.summary?.launchReady),
    featuresSummary: {
      total: features.length,
      byAudience,
      pendingCert: pendingFeatures.map((f) => ({ id: f.id, title: f.title, nav: f.nav })),
    },
    v2Order: ["V2-A", "V2-B", "V2-C", "V2-D", "V2-E", "V2-F"],
  });
});
