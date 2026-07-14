import type { PulseItem } from "@/lib/community-workspace";

const TONE_STYLES: Record<PulseItem["tone"], string> = {
  info: "border-slate-200 bg-white text-slate-900 shadow-sm",
  action: "border-brand-300 bg-brand-50 text-brand-950 shadow-sm",
  celebrate: "border-emerald-300 bg-emerald-50 text-emerald-950 shadow-sm",
};

export function CommunityPulse({ items }: { items: PulseItem[] }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-brand-50/70 shadow-sm">
      <div className="border-b border-brand-100/80 px-6 py-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-900">
          Community pulse
        </h2>
      </div>
      <ul className="space-y-2 p-4 sm:p-5">
        {items.map((item) => (
          <li
            key={item.id}
            className={`rounded-xl border px-3.5 py-2.5 text-sm leading-snug ${TONE_STYLES[item.tone]}`}
          >
            {item.text}
          </li>
        ))}
      </ul>
    </section>
  );
}
