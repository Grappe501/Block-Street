"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { CivicResourceCardProjection } from "@/lib/civic-resources/types";

type Props = {
  projectionEn: CivicResourceCardProjection;
  projectionEs: CivicResourceCardProjection;
  copyEn: Record<string, string>;
  copyEs: Record<string, string>;
};

export function GetLoudPresentClient({ projectionEn, projectionEs, copyEn, copyEs }: Props) {
  const [locale, setLocale] = useState<"en" | "es">("en");
  const projection = locale === "es" ? projectionEs : projectionEn;
  const copy = locale === "es" ? copyEs : copyEn;

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <p className="text-sm uppercase tracking-widest text-slate-300">Get Loud Arkansas · External resource</p>
        <h1 className="mt-3 text-4xl font-bold">{copy.qrHeading}</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-200">{copy.qrSubtext}</p>
        <p className="mt-2 text-sm text-slate-400">Scan with your phone</p>
        <Image
          src={projection.qrApiPath}
          alt={`QR code for ${projection.destinationDomain}`}
          width={360}
          height={360}
          unoptimized
          className="mt-8 rounded-2xl bg-white p-4"
        />
        <p className="mt-6 text-2xl font-mono">{projection.destinationDomain}</p>
        <p className="mt-4 text-sm text-slate-300">{copy.followUpReminder}</p>
        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={() => setLocale("en")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${locale === "en" ? "bg-white text-slate-900" : "border border-white/30"}`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLocale("es")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${locale === "es" ? "bg-white text-slate-900" : "border border-white/30"}`}
          >
            Español
          </button>
        </div>
        <Link href={projection.learnHref} className="mt-8 text-sm text-brand-200 underline">
          {copy.learnHow}
        </Link>
      </div>
    </div>
  );
}
