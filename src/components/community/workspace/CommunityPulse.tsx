import type { PulseItem } from "@/lib/community-workspace";

const TONE_STYLES: Record<PulseItem["tone"], string> = {
  info: "border-slate-200 bg-slate-50 text-slate-800",
  action: "border-brand-200 bg-brand-50 text-brand-950",
  celebrate: "border-green-200 bg-green-50 text-green-900",
};

export function CommunityPulse({ items }: { items: PulseItem[] }) {
  return (
    <section className="card border-brand-100 bg-gradient-to-br from-white to-brand-50/40">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-800">Community Pulse</h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className={`rounded-lg border px-3 py-2 text-sm ${TONE_STYLES[item.tone]}`}
          >
            {item.text}
          </li>
        ))}
      </ul>
    </section>
  );
}
