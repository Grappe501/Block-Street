/** Named secondary window for the Field Strategy Manual / Field Platform. */
export const FIELD_MANUAL_WINDOW_NAME = "kg_field_strategy_manual";

export const FIELD_MANUAL_DEFAULT_PATH = "/field-strategy";

/**
 * Regnat Populus Field Platform (standalone Vite + Netlify site).
 * Override with NEXT_PUBLIC_FIELD_PLATFORM_URL after the Netlify production domain is live.
 */
export const FIELD_PLATFORM_URL =
  process.env.NEXT_PUBLIC_FIELD_PLATFORM_URL?.trim() ||
  "https://kelly-field-operations.netlify.app";

const POPUP_FEATURES = [
  "popup=yes",
  "width=1280",
  "height=860",
  "left=80",
  "top=40",
  "resizable=yes",
  "scrollbars=yes",
  "menubar=no",
  "toolbar=yes",
  "location=yes",
  "status=yes",
].join(",");

function openNamedWindow(href: string, name: string): Window | null {
  if (typeof window === "undefined") return null;
  const win = window.open(href, name, POPUP_FEATURES);
  if (win) {
    try {
      win.focus();
    } catch {
      /* blocked or cross-origin after navigate */
    }
  }
  return win;
}

/**
 * Opens (or focuses) the in-app Field Manual in a second browser window.
 * The original dashboard stays active; the user can minimize or close the manual independently.
 */
export function openFieldManualWindow(path: string = FIELD_MANUAL_DEFAULT_PATH): Window | null {
  const href = path.startsWith("http")
    ? path
    : `${window.location.origin}${path.startsWith("/") ? path : `/${path}`}`;
  return openNamedWindow(href, FIELD_MANUAL_WINDOW_NAME);
}

/** Opens the statewide Regnat Populus Field Platform (county pages + Field Command). */
export function openFieldPlatformWindow(path: string = "/"): Window | null {
  const base = FIELD_PLATFORM_URL.replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return openNamedWindow(`${base}${suffix === "/" ? "" : suffix}`, "kg_regnat_populus_field");
}
