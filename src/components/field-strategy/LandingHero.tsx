import Link from "next/link";
import {
  CLOSING_MESSAGE,
  DOCTRINE,
  LANDING_CHAIN,
  OVERVIEW_CARDS,
  SCALE_OBJECTIVES,
} from "@/lib/field-strategy/content";
import { ChainFlow } from "./ChainFlow";

export function LandingHero() {
  return (
    <div>
      <section className="relative min-h-[100svh] overflow-hidden bg-field-dusk text-field-mist">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 55% at 15% 20%, rgba(212,176,106,0.28), transparent 55%), radial-gradient(ellipse 70% 50% at 85% 75%, rgba(47,107,79,0.55), transparent 50%), linear-gradient(165deg, #0f1c18 0%, #143529 45%, #1a2420 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 top-24 h-72 w-72 rounded-full border border-field-wheat/20 animate-fieldPulse"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-24 left-[8%] h-40 w-40 rounded-full border border-field-canopy/30"
        />

        <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-4 pb-14 pt-28 sm:px-6 sm:pb-20">
          <p className="animate-fieldRise font-fieldSans text-[11px] font-semibold uppercase tracking-[0.22em] text-field-wheat">
            Kelly Grappe · Field Strategy Manual
          </p>
          <h1 className="mt-4 max-w-4xl animate-fieldRise font-fieldDisplay text-5xl leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Regnat Populus
          </h1>
          <p
            className="mt-3 max-w-xl animate-fieldRise font-fieldSans text-xl text-field-wheat/95 sm:text-2xl"
            style={{ animationDelay: "80ms" }}
          >
            The People-Powered Field Strategy
          </p>
          <p
            className="mt-5 max-w-2xl animate-fieldRise font-fieldSans text-base leading-relaxed text-field-mist/85 sm:text-lg"
            style={{ animationDelay: "140ms" }}
          >
            We are not traveling Arkansas simply to hold events. We are using every event to build the
            organization required to win.
          </p>
          <div className="mt-8 flex flex-wrap gap-3" style={{ animationDelay: "200ms" }}>
            <Link
              href="/field-strategy/presentation"
              className="rounded-lg bg-field-wheat px-5 py-3 font-fieldSans text-sm font-bold text-field-dusk"
            >
              Start Presentation
            </Link>
            <Link
              href="/field-strategy/event-engine"
              className="rounded-lg border border-white/25 bg-white/5 px-5 py-3 font-fieldSans text-sm font-semibold text-white backdrop-blur"
            >
              Explore the Event Engine
            </Link>
            <Link
              href="/field-strategy/benton"
              className="rounded-lg border border-field-wheat/40 px-5 py-3 font-fieldSans text-sm font-semibold text-field-wheat"
            >
              Benton County
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-field-pine/10 bg-field-paper px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="font-fieldSans text-[11px] font-semibold uppercase tracking-[0.16em] text-field-moss">
            Central doctrine
          </p>
          <blockquote className="mt-4 max-w-4xl font-fieldDisplay text-2xl leading-snug text-field-pine sm:text-3xl">
            {DOCTRINE}
          </blockquote>
          <p className="mt-4 font-fieldSans text-sm font-semibold text-field-grit">
            Every event is a beginning, not an ending.
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-b from-field-mist to-white px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="font-fieldSans text-[11px] font-semibold uppercase tracking-[0.16em] text-field-moss">
            Statewide organizing chain
          </p>
          <h2 className="mt-2 font-fieldDisplay text-3xl text-field-ink sm:text-4xl">
            From event scheduled to election strength
          </h2>
          <div className="mt-8 rounded-2xl border border-field-pine/12 bg-white/70 p-5 sm:p-7">
            <ChainFlow steps={LANDING_CHAIN} />
          </div>
        </div>
      </section>

      <section className="bg-field-pine px-4 py-10 text-field-mist sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="font-fieldSans text-[11px] font-semibold uppercase tracking-[0.16em] text-field-wheat">
            Strategic objectives — not claims of completed work
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SCALE_OBJECTIVES.map((item) => (
              <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 px-4 py-4">
                <p className="font-fieldDisplay text-xl text-white">{item.label}</p>
                <p className="mt-1 font-fieldSans text-[11px] uppercase tracking-wide text-field-wheat/80">
                  {item.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-fieldDisplay text-3xl text-field-ink">What every event builds</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {OVERVIEW_CARDS.map((card, i) => (
              <div
                key={card.title}
                className="rounded-2xl border border-field-pine/12 bg-white p-4 animate-fieldRise"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <h3 className="font-fieldDisplay text-xl text-field-pine">{card.title}</h3>
                <p className="mt-2 font-fieldSans text-sm leading-relaxed text-field-ink/80">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-field-pine/10 bg-field-dusk px-4 py-14 text-field-mist sm:px-6">
        <div className="mx-auto max-w-3xl">
          {CLOSING_MESSAGE.map((line) => (
            <p key={line} className="mt-3 font-fieldSans text-base leading-relaxed text-field-mist/90 first:mt-0">
              {line}
            </p>
          ))}
          <p className="mt-6 font-fieldDisplay text-4xl text-field-wheat">The People Rule.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/field-strategy/presentation"
              className="rounded-lg bg-field-wheat px-5 py-3 font-fieldSans text-sm font-bold text-field-dusk"
            >
              Presentation Mode
            </Link>
            <Link
              href="/field-strategy/benton"
              className="rounded-lg border border-white/25 px-5 py-3 font-fieldSans text-sm font-semibold text-white"
            >
              Benton County page
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
