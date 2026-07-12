import Link from "next/link";
import type { CommunityWorkspaceView } from "@/lib/community-workspace";

export function PeopleDirectoryGate({ workspace }: { workspace: CommunityWorkspaceView }) {
  const joinPath = workspace.signupSchool
    ? `/join?county=${workspace.countySlug}&school=${workspace.signupSchool}`
    : `/join?county=${workspace.countySlug}`;

  return (
    <section className="card border-dashed border-slate-300 bg-slate-50/50">
      <h2 className="text-lg font-bold text-slate-900">People in Our Network</h2>
      <p className="mt-2 text-sm text-slate-600">
        Search and connect with organizers in <strong>{workspace.shortName}</strong> — members only.
        You build your network in the community where you belong.
      </p>
      {workspace.memberCount != null && (
        <p className="mt-2 text-sm text-slate-500">
          ~{workspace.memberCount.toLocaleString()} members in our workspace (estimate)
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={`/login?next=${encodeURIComponent(joinPath)}`}
          className="btn-primary"
        >
          Sign in to find people
        </Link>
        <Link href={joinPath} className="btn-secondary">
          Join our community
        </Link>
      </div>
      <p className="mt-3 text-xs text-slate-400">
        Phase 1: directory search, intro requests, and meetup-based connections.
      </p>
    </section>
  );
}
