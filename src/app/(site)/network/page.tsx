"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { NetworkBoard } from "@/lib/network/types";
import { copyTextToClipboard } from "@/lib/browser/copy-text";

export default function NetworkBoardPage() {
  const router = useRouter();
  const [board, setBoard] = useState<NetworkBoard | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    (async () => {
      const s = await fetch("/api/auth/session");
      if (!s.ok) {
        router.replace("/login?next=/network");
        return;
      }
      const p = await fetch("/api/launch/home-place");
      const pd = await p.json();
      const sd = await s.json();
      const email = sd.profile?.primary_email as string | undefined;
      const isAdmin = email === "grappe4arkansas@gmail.com" || email === "director@block-street.local";
      if (!pd.place && !isAdmin) {
        router.replace("/choose-place");
        return;
      }

      const res = await fetch("/api/network/board");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not load network");
        return;
      }
      setBoard(data.board);
      setShareUrl(`${window.location.origin}${data.board.share_url_path}`);
    })();
  }, [router]);

  async function copyLink() {
    if (!shareUrl) return;
    const ok = await copyTextToClipboard(shareUrl);
    if (!ok) {
      setError("Clipboard blocked — select the share link and press Ctrl+C.");
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10">
        <p className="text-red-700" role="alert">
          {error}
        </p>
      </div>
    );
  }

  if (!board) {
    return <div className="mx-auto max-w-lg px-4 py-16 text-center text-slate-500">Loading your network…</div>;
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <p className="text-sm font-medium text-brand-700">My Network</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">{board.profile.preferred_name}&apos;s board</h1>
      {board.home_place ? (
        <p className="mt-2 text-slate-600">
          Home: <span className="font-semibold text-slate-900">{board.home_place.name}</span>
        </p>
      ) : (
        <p className="mt-2 text-slate-600">
          <Link href="/choose-place" className="text-brand-700 underline">
            Choose your organizing home
          </Link>
        </p>
      )}

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Invite others</h2>
        <p className="mt-1 break-all text-sm text-slate-600">{shareUrl}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copyLink}
            className="rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
          >
            {copied ? "Copied" : "Copy share link"}
          </button>
          <a
            href="/api/network/qr"
            download
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:border-brand-400"
          >
            Download QR
          </a>
        </div>
        <img
          src="/api/network/qr"
          alt="QR code for your share link"
          className="mt-4 h-40 w-40 rounded border border-slate-100 bg-white p-2"
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-brand-700">{board.stats.network_size}</p>
          <p className="text-xs text-slate-600">In your network</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-brand-700">{board.invites_pending}</p>
          <p className="text-xs text-slate-600">Invites pending</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">People you brought in</h2>
        {board.members.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No one yet — share your link or create an invite from Start.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {board.members.map((m) => (
              <li key={m.user_id} className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                <p className="font-semibold text-slate-900">{m.display_name}</p>
                <p className="text-xs text-slate-500">
                  via {m.via} · {new Date(m.joined_at).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-10 space-y-3">
        <Link href="/app" className="block text-center text-sm font-medium text-brand-700 hover:underline">
          Open place hub
        </Link>
        <Link href="/start" className="block text-center text-sm font-medium text-slate-600 hover:underline">
          Create a direct invite
        </Link>
      </div>
    </div>
  );
}
