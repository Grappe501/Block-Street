import Link from "next/link";
import type { ReactNode } from "react";

export function CollegeChrome({
  slug,
  name,
  title,
  children,
}: {
  slug: string;
  name: string;
  title?: string;
  children: ReactNode;
}) {
  const base = `/college/${slug}`;
  const links = [
    ["", "Home"],
    ["plan", "30-day plan"],
    ["teams", "Teams"],
    ["positions", "Positions"],
    ["voter-registration", "Voter registration"],
    ["social-event", "Networking event"],
    ["calendar", "Calendar"],
    ["power-of-5", "Power of 5"],
    ["recruit", "Recruit"],
    ["people", "People"],
  ] as const;

  return (
    <div className="min-h-screen bg-field-paper text-field-ink">
      <header className="border-b border-field-ink/10 bg-field-dusk text-field-mist">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-fieldSans text-[11px] font-semibold uppercase tracking-[0.14em] text-field-wheat">
                College Community
              </p>
              <h1 className="font-fieldDisplay text-2xl tracking-tight text-white">{name}</h1>
              {title ? <p className="font-fieldSans text-sm text-field-mist/90">{title}</p> : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/command/campus/${slug}`}
                className="rounded-lg bg-field-wheat px-3 py-2 font-fieldSans text-xs font-bold text-field-dusk"
              >
                Campus board
              </Link>
              <Link
                href="/presentations/july-14"
                className="rounded-lg border border-white/25 px-3 py-2 font-fieldSans text-xs font-bold text-field-mist"
              >
                July 14 hub
              </Link>
            </div>
          </div>
          <nav className="mt-3 flex gap-1 overflow-x-auto pb-1 font-fieldSans text-xs font-semibold">
            {links.map(([path, label]) => (
              <Link
                key={path || "home"}
                href={path ? `${base}/${path}` : base}
                className="shrink-0 rounded-md px-2.5 py-1.5 text-field-mist/85 hover:bg-white/10 hover:text-white"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6 text-field-ink sm:px-6">{children}</main>
      <footer className="mx-auto max-w-4xl px-4 pb-10 font-fieldSans text-xs text-field-ink/65 sm:px-6">
        Soft beta · Interest is not appointment · Invite-chain PRESENT not CERTIFIED · Campus plans are not approval or legal
        certification · Same-lane leaders connect to campaign boards under CM/ACM; Event Board under Carol Eagan
      </footer>
    </div>
  );
}
