import Link from "next/link";
import { CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { getCommandLane, listCommandGoals } from "@/lib/command/board";

export const metadata = { title: "July 14 goals · broken out" };

export default function July14GoalsPage() {
  const goals = listCommandGoals();

  return (
    <CommandChrome
      title="Goals — broken out"
      subtitle="Each long-term goal from the meeting stands alone with an owner lane. Optional — stay on the agenda when presenting."
      backHref="/presentations/july-14"
      backLabel="Presentation hub"
      eyebrow="July 14 · goals"
    >
      <CommandSection title="Meeting goals">
        <ol className="space-y-4">
          {goals.map((goal, i) => {
            const lane = getCommandLane(goal.owner_lane);
            return (
              <li key={goal.id} className="rounded-xl border border-field-ink/15 bg-white p-5 shadow-sm">
                <p className="font-fieldSans text-xs font-semibold uppercase tracking-[0.14em] text-field-pine">
                  Goal {i + 1} · agenda {goal.agenda_items.join(", ")}
                </p>
                <h3 className="mt-1 font-fieldDisplay text-2xl text-field-ink">{goal.title}</h3>
                <p className="mt-2 font-fieldSans text-sm leading-relaxed text-field-ink/80">{goal.explain}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {lane ? (
                    <Link
                      href={`/command/campaign/${lane.id}`}
                      className="font-fieldSans text-xs font-bold text-field-pine underline"
                    >
                      Owner lane: {lane.label}
                    </Link>
                  ) : null}
                  {goal.agenda_items.map((item) => (
                    <Link
                      key={item}
                      href={`/presentations/july-14/presenter?item=${item}`}
                      className="font-fieldSans text-xs font-semibold text-field-ink/70 underline"
                    >
                      Item {item}
                    </Link>
                  ))}
                </div>
              </li>
            );
          })}
        </ol>
      </CommandSection>
    </CommandChrome>
  );
}
