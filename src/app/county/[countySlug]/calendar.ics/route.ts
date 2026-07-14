import { buildIcsCalendar } from "@/lib/calendar";

export const dynamic = "force-dynamic";

export function GET(_req: Request, ctx: { params: Promise<{ countySlug: string }> }) {
  return ctx.params.then(({ countySlug }) => {
    const body = buildIcsCalendar("county", countySlug);
    return new Response(body, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${countySlug}-calendar.ics"`,
      },
    });
  });
}
