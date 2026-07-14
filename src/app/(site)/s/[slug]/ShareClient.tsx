"use client";

import { useEffect } from "react";
import Link from "next/link";

type Card = {
  share_slug: string;
  display_name: string;
  preferred_name: string;
  home_place_name: string | null;
};

export function RedirectShareClient({ card, referralCookie }: { card: Card; referralCookie: string }) {
  useEffect(() => {
    document.cookie = `${referralCookie}=${encodeURIComponent(card.share_slug)}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
  }, [card.share_slug, referralCookie]);

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <p className="text-sm font-medium text-brand-700">You&apos;re almost in</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">Join {card.preferred_name} on Block Street</h1>
      <p className="mt-3 text-lg text-slate-600">
        {card.display_name} invited you to organize together
        {card.home_place_name ? (
          <>
            {" "}
            · <span className="font-semibold text-slate-900">{card.home_place_name}</span>
          </>
        ) : null}
        .
      </p>
      <p className="mt-6 text-sm text-slate-600">
        Soft beta is invitation-only. Ask {card.preferred_name} for their personal invite link, then paste it on the next
        screen. Already have an account? Sign in.
      </p>
      <div className="mt-8 space-y-3">
        <Link
          href="/join"
          className="block rounded-xl bg-brand-700 px-4 py-4 text-center font-semibold text-white hover:bg-brand-800"
        >
          I have an invite link — continue
        </Link>
        <Link
          href="/login?next=/network"
          className="block rounded-xl border border-slate-200 bg-white px-4 py-4 text-center font-semibold text-slate-900 hover:border-brand-400"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
