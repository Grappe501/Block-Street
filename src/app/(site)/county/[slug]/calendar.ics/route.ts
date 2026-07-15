import { buildIcsCalendar } from "@/lib/calendar";

export const dynamic = "force-dynamic";

export function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  return ctx.params.then(({ slug }) => {
    const body = buildIcsCalendar("county", slug);
    return new Response(body, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${slug}-calendar.ics"`,
      },
    });
  });
}
