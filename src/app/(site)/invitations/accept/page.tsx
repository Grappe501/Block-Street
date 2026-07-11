import { Suspense } from "react";
import InvitationAcceptClient from "./InvitationAcceptClient";

export default function InvitationAcceptPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading…</div>}>
      <InvitationAcceptClient />
    </Suspense>
  );
}
