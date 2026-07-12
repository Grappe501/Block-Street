import { getIdentityTrustOverview, listIdentityReviews } from "./engine";
import { listAppeals } from "./governance";
import { getInvitationAnalytics } from "./invitations";
import { listIntelligenceAlerts } from "./intelligence";
import type { IdentityOperationsDashboard } from "./types";
import { isWave6FoundationComplete } from "./wave6/engine";
import { getOperationsOverview, getDeadlines, getOperationalAlerts } from "./wave6/overview";
import { listWorkItems } from "./wave6/queue";
import { syncWorkItemsFromSources } from "./wave6/migration";

export function getIdentityOperationsDashboard(actorId: string): IdentityOperationsDashboard & Record<string, unknown> {
  if (isWave6FoundationComplete()) {
    syncWorkItemsFromSources();
    const ops = getOperationsOverview();
    const workItems = listWorkItems({ assigned_to: actorId });
    return {
      overview: getIdentityTrustOverview(),
      review_queue: listIdentityReviews("open").concat(listIdentityReviews("under_review")),
      appeals_queue: listAppeals("submitted").concat(listAppeals("under_review")),
      verification_queue: [],
      intelligence_alerts: listIntelligenceAlerts("open"),
      invitation_analytics: getInvitationAnalytics(),
      wave6: {
        command_center: ops,
        my_work_items: workItems,
        deadlines: getDeadlines(),
        alerts: getOperationalAlerts(),
        assigned_count: workItems.length,
      },
    };
  }

  return {
    overview: getIdentityTrustOverview(),
    review_queue: listIdentityReviews("open").concat(listIdentityReviews("under_review")),
    appeals_queue: listAppeals("submitted").concat(listAppeals("under_review")),
    verification_queue: [],
    intelligence_alerts: listIntelligenceAlerts("open"),
    invitation_analytics: getInvitationAnalytics(),
  };
}
