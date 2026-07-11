import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { loadWebhookSubscriptions } from "@/lib/api/gateway";
import { loadWebhookDeliveries } from "@/lib/api/data";

export const GET = withAdmin(() => {
  return NextResponse.json({
    subscriptions: loadWebhookSubscriptions(),
    deliveries: loadWebhookDeliveries(),
  });
});
