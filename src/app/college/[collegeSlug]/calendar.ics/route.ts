import { buildIcsCalendar } from "@/lib/calendar";

export const dynamic = "force-dynamic";

export function GET(_req: Request, ctx: { params: Promise<{ collegeSlug: string }> }) {
  return ctx.params.then(({ collegeSlug }) => {
    const body = buildIcsCalendar("college", collegeSlug);
    return new Response(body, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${collegeSlug}-calendar.ics"`,
      },
    });
  });
}
