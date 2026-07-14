import { buildIcsCalendar } from "@/lib/calendar";

export const dynamic = "force-dynamic";

export function GET() {
  const body = buildIcsCalendar("kelly");
  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="kelly-public.ics"',
      "X-Block-Street-Note": "Public confirmed appearances only — private Kelly calendar is never exported.",
    },
  });
}
