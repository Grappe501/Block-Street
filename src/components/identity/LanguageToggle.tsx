"use client";

import { useEffect, useState } from "react";
import { getStoredLocale, setStoredLocale, t, type IdentityLocale } from "@/lib/july14/i18n";

export function LanguageToggle({ onChange }: { onChange?: (locale: IdentityLocale) => void }) {
  const [locale, setLocale] = useState<IdentityLocale>("en");

  useEffect(() => {
    setLocale(getStoredLocale());
  }, []);

  function switchLocale(next: IdentityLocale) {
    setStoredLocale(next);
    setLocale(next);
    onChange?.(next);
  }

  return (
    <div className="flex items-center gap-1 text-xs" role="group" aria-label="Language">
      <button
        type="button"
        onClick={() => switchLocale("en")}
        className={`rounded px-2 py-1 ${locale === "en" ? "bg-indigo-700 text-white" : "text-slate-600 hover:bg-slate-100"}`}
        aria-pressed={locale === "en"}
      >
        {t("lang.english", locale)}
      </button>
      <span className="text-slate-400">|</span>
      <button
        type="button"
        onClick={() => switchLocale("es")}
        className={`rounded px-2 py-1 ${locale === "es" ? "bg-indigo-700 text-white" : "text-slate-600 hover:bg-slate-100"}`}
        aria-pressed={locale === "es"}
      >
        {t("lang.spanish", locale)}
      </button>
    </div>
  );
}

export function useIdentityLocale() {
  const [locale, setLocale] = useState<IdentityLocale>("en");
  useEffect(() => setLocale(getStoredLocale()), []);
  return { locale, setLocale: (l: IdentityLocale) => { setStoredLocale(l); setLocale(l); }, t: (k: string) => t(k, locale) };
}
