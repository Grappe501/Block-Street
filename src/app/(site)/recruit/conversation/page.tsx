import Link from "next/link";
import { MeetingChrome } from "@/components/meeting/MeetingChrome";

export const metadata = {
  title: "Recruit conversation — soft beta",
};

export default function RecruitConversationPage() {
  return (
    <MeetingChrome
      title="Conversation"
      subtitle="Keep it human. Soft beta is a welcome — not a pitch deck."
    >
      <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
        <li>“We’re organizing so students aren’t an afterthought — want to see how it works?”</li>
        <li>“Every campus shapes the work for its community. There’s an open seat if you want one.”</li>
        <li>“Soft beta means we tell the truth about what’s ready. Your feedback makes it better.”</li>
      </ul>
      <p className="mt-6 text-sm font-semibold">
        <Link href="/recruit" className="text-brand-800 underline-offset-2 hover:underline">
          ← Recruit
        </Link>
        {" · "}
        <Link href="/recruit/text" className="text-brand-800 underline-offset-2 hover:underline">
          Text patterns →
        </Link>
      </p>
    </MeetingChrome>
  );
}
