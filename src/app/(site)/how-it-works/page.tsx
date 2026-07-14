import Link from "next/link";
import { MeetingChrome, MeetingLinkList } from "@/components/meeting/MeetingChrome";
import { HonestyPanel } from "@/components/meeting/HonestyPanel";

export const metadata = {
  title: "How it works — soft beta",
};

export default function HowItWorksPage() {
  return (
    <MeetingChrome
      title="How it works"
      subtitle="A welcoming map of structure, participation, and honesty — so you always know what’s ready and what’s still being completed."
    >
      <MeetingLinkList
        items={[
          {
            href: "/how-it-works/hierarchy",
            label: "Hierarchy",
            note: "Director → Volunteer Manager → commands → volunteers",
          },
          {
            href: "/how-it-works/participation-journey",
            label: "Participation journey",
            note: "Explore → interest → seat path → invite peers",
          },
          {
            href: "/how-it-works/system-status",
            label: "System status",
            note: "Working now vs still completing",
          },
        ]}
      />
      <p className="mt-6 text-sm text-slate-600">
        Ready for a seat?{" "}
        <Link href="/positions/college" className="font-semibold text-brand-800 underline-offset-2 hover:underline">
          Browse College Team positions
        </Link>
      </p>
      <div className="mt-8">
        <HonestyPanel />
      </div>
    </MeetingChrome>
  );
}
