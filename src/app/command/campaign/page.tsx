import { CommandCard, CommandChrome, CommandSection } from "@/components/command/CommandChrome";
import { listCommandLanes } from "@/lib/command/board";

export const metadata = { title: "Campaign lane boards" };

export default function CampaignBoardsPage() {
  const lanes = listCommandLanes();
  return (
    <CommandChrome
      title="Campaign lane boards"
      subtitle="Each lane has a campaign board. Campus team leaders on the same lane connect here. CM and ACM oversee all lanes; Event Board (Carol Eagan) owns the events lane operationally."
    >
      <CommandSection title="Lanes">
        <div className="grid gap-3">
          {lanes.map((lane) => (
            <CommandCard
              key={lane.id}
              href={`/command/campaign/${lane.id}`}
              title={lane.label}
              note={
                lane.under_events_board
                  ? `Under Event Board · ${lane.board_owner} · ${lane.goal}`
                  : lane.goal
              }
              accent={lane.under_events_board}
            />
          ))}
        </div>
      </CommandSection>
    </CommandChrome>
  );
}
