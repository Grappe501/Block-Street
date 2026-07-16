"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { CivicResourceCardProjection, GetLoudCardVariant } from "@/lib/civic-resources/types";

type Props = {
  projection: CivicResourceCardProjection;
  variant?: GetLoudCardVariant;
  className?: string;
};

export function GetLoudRegistrationResourceCard({ projection, variant = "compact", className = "" }: Props) {
  const [showQr, setShowQr] = useState(false);
  const [showSensitiveWarning, setShowSensitiveWarning] = useState(false);
  const [copied, setCopied] = useState(false);

  const unavailable = projection.status !== "active";

  const openForm = () => {
    if (unavailable) return;
    setShowSensitiveWarning(true);
  };

  const confirmOpenForm = () => {
    window.open(projection.formUrl, "_blank", "noopener,noreferrer");
    setShowSensitiveWarning(false);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(projection.formUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const qrSrc = useMemo(() => projection.qrApiPath, [projection.qrApiPath]);

  if (unavailable) {
    return (
      <section className={`rounded-2xl border border-slate-200 bg-slate-50 p-5 ${className}`} aria-live="polite">
        <h2 className="text-lg font-bold text-slate-900">Voter registration resource temporarily unavailable</h2>
        <p className="mt-2 text-sm text-slate-600">
          The external registration assistance link is being reviewed. You can still use official Arkansas resources.
        </p>
        <Link href={projection.confirmationUrl} className="mt-3 inline-block text-sm font-semibold text-brand-700 underline" target="_blank" rel="noopener noreferrer">
          Arkansas VoterView
        </Link>
      </section>
    );
  }

  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
      aria-labelledby="get-loud-card-title"
      data-variant={variant}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">External civic resource</p>
      <h2 id="get-loud-card-title" className="mt-1 text-lg font-bold text-slate-900">
        {projection.title}
      </h2>
      <p className="mt-2 text-sm text-slate-700">{projection.shortDescription}</p>
      <p className="mt-3 text-xs text-slate-600">{projection.shortDisclosure}</p>

      {variant === "voter_registration_command" && (
        <div className="mt-4 space-y-2 rounded-lg border border-brand-100 bg-brand-50/40 p-3 text-sm text-slate-700">
          <p>
            <strong>Conversation guide:</strong> Would you like help finding a voter-registration application? Get Loud
            Arkansas offers an independent tool that helps prepare Arkansas&apos;s paper application. Block-Street does
            not operate the form or receive the information entered.
          </p>
          <p className="text-xs text-slate-600">
            After applying, confirm registration with your county clerk or Arkansas VoterView.
          </p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {variant !== "compact" || showQr ? (
          <button
            type="button"
            onClick={() => setShowQr((v) => !v)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800"
          >
            {showQr ? "Hide QR" : "Show QR"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowQr(true)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800"
          >
            Show QR
          </button>
        )}
        <button
          type="button"
          onClick={openForm}
          className="rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white hover:bg-brand-700"
        >
          Open external form
        </button>
        <Link href={projection.learnHref} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800">
          Learn how
        </Link>
        {(variant === "standard" || variant === "voter_registration_command") && (
          <>
            <Link href={projection.printHref} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800">
              Print
            </Link>
            <Link href={projection.presentHref} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800">
              Present
            </Link>
          </>
        )}
        <button type="button" onClick={copyLink} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800">
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>

      {showQr && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">Scan to open the Get Loud Easy Application</p>
          <p className="mt-1 text-xs text-slate-600">
            External form operated by Get Loud Arkansas. Block-Street will not receive your answers.
          </p>
          <div className="mt-3 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Image
              src={qrSrc}
              alt={`QR code linking to ${projection.destinationDomain}`}
              width={160}
              height={160}
              unoptimized
              className="rounded-lg border border-slate-200 bg-white p-2"
            />
            <div className="text-xs text-slate-600">
              <p className="font-mono text-slate-800">{projection.destinationDomain}</p>
              <a href={projection.formUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block break-all text-brand-700 underline">
                {projection.formUrl}
              </a>
            </div>
          </div>
        </div>
      )}

      {variant === "voter_registration_command" && (
        <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <Link href={projection.confirmationUrl} target="_blank" rel="noopener noreferrer" className="text-brand-700 underline">
            Confirm registration (Arkansas VoterView)
          </Link>
          <Link href={projection.homepageUrl} target="_blank" rel="noopener noreferrer" className="text-brand-700 underline">
            Get Loud Arkansas homepage
          </Link>
        </div>
      )}

      {showSensitiveWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="sensitive-warning-title">
          <div className="max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <h3 id="sensitive-warning-title" className="text-lg font-bold text-slate-900">Before you open the external form</h3>
            <p className="mt-3 text-sm text-slate-700">{projection.sensitiveWarning}</p>
            <p className="mt-3 text-xs text-slate-600">
              You will leave Block-Street and go directly to {projection.destinationDomain}.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={confirmOpenForm} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
                Continue to external form
              </button>
              <button type="button" onClick={() => setShowSensitiveWarning(false)} className="rounded-lg border px-4 py-2 text-sm font-semibold">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
