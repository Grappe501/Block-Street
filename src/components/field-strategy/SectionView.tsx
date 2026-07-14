import Link from "next/link";
import type { ManualSection } from "@/lib/field-strategy/content";
import { ChainFlow } from "./ChainFlow";
import { DepthTabs } from "./DepthTabs";

export function SectionView({ section }: { section: ManualSection }) {
  return (
    <article className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <p className="animate-fieldRise font-fieldSans text-[11px] font-semibold uppercase tracking-[0.18em] text-field-moss">
        {section.eyebrow}
      </p>
      <h1 className="mt-3 max-w-4xl animate-fieldRise font-fieldDisplay text-4xl leading-[1.1] tracking-tight text-field-ink sm:text-5xl">
        {section.headline}
      </h1>
      <p
        className="mt-4 max-w-3xl animate-fieldRise font-fieldSans text-lg leading-relaxed text-field-ink/85"
        style={{ animationDelay: "60ms" }}
      >
        {section.oneLiner}
      </p>
      <p className="mt-2 font-fieldSans text-xs text-field-moss">{section.levelNote}</p>

      <div className="mt-8 space-y-4">
        {section.overview.map((p) => (
          <p key={p} className="max-w-3xl font-fieldSans text-sm leading-relaxed text-field-ink/90 sm:text-base">
            {p}
          </p>
        ))}
      </div>

      {section.chain?.length ? (
        <div className="mt-10 rounded-2xl border border-field-pine/15 bg-gradient-to-br from-field-mist via-white to-field-paper p-5 sm:p-7">
          <p className="font-fieldSans text-[11px] font-semibold uppercase tracking-[0.14em] text-field-moss">
            Operating flow
          </p>
          <div className="mt-5">
            <ChainFlow steps={section.chain} />
          </div>
        </div>
      ) : null}

      {section.roles?.length ? (
        <div className="mt-10">
          <p className="font-fieldSans text-[11px] font-semibold uppercase tracking-[0.14em] text-field-moss">
            Key roles
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {section.roles.map((role) => (
              <div
                key={role.title}
                className="rounded-2xl border border-field-pine/12 bg-white p-4"
              >
                <h3 className="font-fieldDisplay text-xl text-field-pine">{role.title}</h3>
                <p className="mt-1 font-fieldSans text-xs leading-relaxed text-field-ink/75">{role.summary}</p>
                <ul className="mt-3 space-y-1">
                  {role.items.map((item) => (
                    <li key={item} className="font-fieldSans text-xs text-field-ink/85">
                      · {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-10">
        <DepthTabs tabs={section.tabs} />
      </div>

      {section.success?.length ? (
        <div className="mt-10 rounded-2xl border border-field-wheat/50 bg-field-dusk px-5 py-5 text-field-mist">
          <p className="font-fieldSans text-[11px] font-semibold uppercase tracking-[0.14em] text-field-wheat">
            Measures of progress
          </p>
          <ul className="mt-3 space-y-2">
            {section.success.map((s) => (
              <li key={s} className="font-fieldSans text-sm">
                {s}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Link
          href={section.nextHref}
          className="rounded-lg bg-field-pine px-5 py-3 font-fieldSans text-sm font-bold text-field-mist transition hover:bg-field-moss"
        >
          {section.nextLabel} →
        </Link>
        <Link
          href="/field-strategy/presentation"
          className="rounded-lg border border-field-pine/25 bg-white px-5 py-3 font-fieldSans text-sm font-semibold text-field-pine"
        >
          Presentation Mode
        </Link>
      </div>
    </article>
  );
}
