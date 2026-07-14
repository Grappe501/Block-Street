import Link from "next/link";
import type { Institution } from "@/lib/data";

export function CollegeChrome({
  college,
  title,
  children,
  orientationReturn,
}: {
  college: Institution;
  title?: string;
  children: React.ReactNode;
  orientationReturn?: boolean;
}) {
  const base = `/college/${college.slug}`;
  return (
    <div className="min-h-screen bg-field-paper text-field-ink">
      <header className="sticky top-0 z-30 border-b border-field-ink/10 bg-field-dusk text-field-mist">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-2 px-4 py-3">
          <div className="min-w-0">
            <p className="font-fieldSans text-[11px] font-semibold uppercase tracking-[0.14em] text-field-wheat">
              College Community
            </p>
            <p className="truncate font-fieldDisplay text-lg text-white">{college.shortName ?? college.name}</p>
            {title ? <p className="font-fieldSans text-xs text-field-mist/85">{title}</p> : null}
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <Link
              href={`/command/campus/${college.slug}`}
              className="rounded-lg bg-field-wheat px-3 py-2 font-fieldSans font-bold text-field-dusk"
            >
              Campus board
            </Link>
            <Link href={base} className="rounded-lg border border-white/25 px-3 py-2 font-fieldSans text-field-mist">
              Home
            </Link>
          </div>
        </div>
        <nav className="mx-auto flex max-w-4xl gap-1 overflow-x-auto px-4 pb-2 font-fieldSans text-[11px] font-semibold uppercase tracking-wide text-field-mist/80">
          {[
            ["", "Home"],
            ["/teams", "Teams"],
            ["/positions", "Positions"],
            ["/voter-registration", "Voter reg"],
            ["/social-event", "Social event"],
            ["/power-of-5", "Power of 5"],
            ["/recruit", "Recruit"],
            ["/plan", "Plan"],
            ["/people", "People"],
          ].map(([path, label]) => (
            <Link
              key={path + label}
              href={`${base}${path}`}
              className="whitespace-nowrap rounded-md px-2 py-1 hover:bg-white/10 hover:text-white"
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8 text-field-ink">{children}</main>
      {orientationReturn ? (
        <div className="border-t border-field-ink/10 bg-white px-4 py-3 text-center">
          <Link href="/presentations/july-14" className="font-fieldSans text-sm font-semibold text-field-pine underline">
            Return to July 14 hub
          </Link>
        </div>
      ) : null}
    </div>
  );
}
