import Link from "next/link";
import { OrientationChrome } from "@/components/orientation/OrientationChrome";
import sections from "@/lib/orientation/sections.json";

export default function OrientationParticipantPage() {
  return (
    <OrientationChrome title="Follow along" mode="participant">
      <p className="font-fieldSans text-sm text-field-mist/85">
        Move through each segment. Tonight centers your College Community.
      </p>
      <ol className="mt-6 space-y-3">
        {sections.segments.map((s, i) => (
          <li key={s.id} className="rounded-xl border border-white/15 bg-black/20 p-4">
            <p className="text-xs font-bold text-field-wheat">
              Step {i + 1} · {s.estimated_duration} min
            </p>
            <h2 className="mt-1 font-fieldDisplay text-lg text-white">{s.title}</h2>
            <p className="mt-2 text-sm text-field-mist/85">{s.participant_text[0]}</p>
            <Link
              href={s.route ?? (i === 2 ? "/colleges" : s.route_template?.replace(":slug", "uark") ?? "/orientation")}
              className="mt-3 inline-block rounded-lg bg-field-wheat/15 px-3 py-2 text-sm font-bold text-field-wheat"
            >
              {s.primary_action} →
            </Link>
          </li>
        ))}
      </ol>
    </OrientationChrome>
  );
}
