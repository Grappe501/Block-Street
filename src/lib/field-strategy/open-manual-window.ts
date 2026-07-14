/** Named secondary window for the standalone Field Strategy Manual. */
export const FIELD_MANUAL_WINDOW_NAME = "kg_field_strategy_manual";

export const FIELD_MANUAL_DEFAULT_PATH = "/field-strategy";

/**
 * Opens (or focuses) the Field Manual in a second browser window.
 * The original dashboard stays active; the user can minimize or close the manual independently.
 */
export function openFieldManualWindow(path: string = FIELD_MANUAL_DEFAULT_PATH): Window | null {
  if (typeof window === "undefined") return null;
  const href = path.startsWith("http")
    ? path
    : `${window.location.origin}${path.startsWith("/") ? path : `/${path}`}`;
  const features = [
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

  const win = window.open(href, FIELD_MANUAL_WINDOW_NAME, features);
  if (win) {
    try {
      win.focus();
    } catch {
      /* blocked or cross-origin after navigate */
    }
  }
  return win;
}
