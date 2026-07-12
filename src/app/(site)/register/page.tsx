"use client";

import Link from "next/link";
import { AuthPageShell } from "@/components/auth/AuthPageShell";

export default function RegisterPage() {
  return (
    <AuthPageShell title="Invitation required" subtitle="This platform is invitation-only">
      <div className="space-y-4 text-sm text-blue-950">
        <p>
          There is no public registration. Every account begins with an invitation from an existing accountable human
          sponsor.
        </p>
        <p className="rounded border border-indigo-200 bg-indigo-50 p-3 text-indigo-950">
          If you received an invitation, open the link in your email to declare our public name and connect our
          authentication method.
        </p>
        <p>
          <Link href="/login" className="font-semibold text-blue-700 underline">
            Sign in
          </Link>{" "}
          if you already accepted an invitation.
        </p>
        <p>
          <Link href="/invitations/accept" className="text-blue-700 underline">
            Accept an invitation
          </Link>
        </p>
      </div>
    </AuthPageShell>
  );
}
