import { Suspense } from "react";
import PasswordlessVerifyClient from "./PasswordlessVerifyClient";

export default function PasswordlessVerifyPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading…</div>}>
      <PasswordlessVerifyClient />
    </Suspense>
  );
}
