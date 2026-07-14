import Link from "next/link";

export function OrientationChrome({
  title,
  children,
  mode,
}: {
  title: string;
  children: React.ReactNode;
  mode?: "presenter" | "participant";
}) {
  return (
    <div className="min-h-screen bg-field-dusk text-field-mist">
      <header className="border-b border-white/10 px-4 py-3">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-2">
          <div>
            <p className="font-fieldSans text-[11px] font-semibold uppercase tracking-[0.18em] text-field-wheat">
              Orientation{mode ? ` · ${mode}` : ""}
            </p>
            <h1 className="font-fieldDisplay text-xl text-white sm:text-2xl">{title}</h1>
          </div>
          <Link href="/orientation" className="font-fieldSans text-xs font-semibold text-field-wheat">
            Orientation home
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
