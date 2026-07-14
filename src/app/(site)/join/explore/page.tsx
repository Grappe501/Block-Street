import Link from "next/link";
import { MeetingChrome, MeetingLinkList } from "@/components/meeting/MeetingChrome";
import { HonestyPanel } from "@/components/meeting/HonestyPanel";

export const metadata = {
  title: "Join explore — soft beta",
};

export default function JoinExplorePage() {
  return (
    <MeetingChrome
      title="Explore"
      subtitle="A soft-beta orientation — structure, seats, and honesty before you commit energy."
      eyebrow="Soft beta · Join"
    >
      <MeetingLinkList
        items={[
          { href: "/how-it-works", label: "How it works", note: "Hierarchy, journey, system status" },
          { href: "/positions/college", label: "College Team seats", note: "Agenda-aligned open roles" },
          { href: "/power-of-5/start", label: "Power of 5", note: "Start with five people you trust" },
          { href: "/presentations/college", label: "College presentation", note: "Walk the soft-beta path" },
          { href: "/join/interest", label: "Ready to express interest?", note: "Not an appointment" },
        ]}
      />
      <p className="mt-6 text-sm">
        <Link href="/join" className="font-semibold text-brand-800 underline-offset-2 hover:underline">
          ← Join home
        </Link>
      </p>
      <div className="mt-8">
        <HonestyPanel />
      </div>
    </MeetingChrome>
  );
}
