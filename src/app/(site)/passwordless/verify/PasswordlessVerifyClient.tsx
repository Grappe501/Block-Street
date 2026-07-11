"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthPageShell } from "@/components/auth/AuthPageShell";

export default function PasswordlessVerifyClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) return;
    fetch("/api/auth/passwordless/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    }).then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Sign-in link invalid");
        return;
      }
      router.push("/account/security");
    });
  }, [searchParams, router]);

  return (
    <AuthPageShell title="Verifying sign-in" subtitle="Please wait while we verify your secure link">
      {error ? (
        <div className="space-y-3 text-sm">
          <p className="text-red-800" role="alert">{error}</p>
          <a href="/passwordless" className="text-blue-700 underline">Request a new secure sign-in link</a>
        </div>
      ) : (
        <p className="text-sm text-blue-800">Verifying…</p>
      )}
    </AuthPageShell>
  );
}
