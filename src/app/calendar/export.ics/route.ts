import { buildIcsCalendar } from "@/lib/calendar";

export const dynamic = "force-dynamic";

export function GET() {
  const body = buildIcsCalendar("universal");
  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="block-street-calendar.ics"',
      "Cache-Control": "public, max-age=300",
    },
  });
}
