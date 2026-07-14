import Link from "next/link";
import { OrientationChrome } from "@/components/orientation/OrientationChrome";
import sections from "@/lib/orientation/sections.json";

export default function OrientationPresenterPage() {
  return (
    <OrientationChrome title="Presenter guide" mode="presenter">
      <p className="font-fieldSans text-sm text-field-mist/85">
        Guide the room through Orientation. Keep College Community primary. County path is available but brief tonight.
      </p>
      <ol className="mt-6 space-y-4">
        {sections.segments.map((s) => (
          <li key={s.id} className="rounded-xl border border-white/10 bg-black/25 p-4">
            <p className="font-fieldSans text-[11px] font-bold uppercase tracking-wide text-field-wheat">
              {s.estimated_duration} min · {s.id}
            </p>
            <h2 className="mt-1 font-fieldDisplay text-xl text-white">{s.title}</h2>
            <p className="mt-2 text-sm text-field-mist/85">{s.short_explanation}</p>
            <ul className="mt-2 list-disc pl-5 text-xs text-field-mist/70">
              {s.presenter_notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            <Link
              href={s.route ?? s.route_template?.replace(":slug", "uark") ?? "/orientation"}
              className="mt-3 inline-block text-sm font-bold text-field-wheat underline"
            >
              {s.primary_action} →
            </Link>
          </li>
        ))}
      </ol>
      <Link
        href="/orientation/next-step"
        className="mt-8 inline-block rounded-lg bg-field-wheat px-4 py-2.5 font-fieldSans text-sm font-bold text-field-dusk"
      >
        Open next-step close →
      </Link>
    </OrientationChrome>
  );
}
