/** Accept a raw token or a full /invite/{token} (or /invitations/accept?token=) URL. */
export function extractInviteToken(raw: string): string {
  const value = raw.trim();
  if (!value) return "";

  try {
    const asUrl = value.includes("://") ? new URL(value) : null;
    if (asUrl) {
      const q = asUrl.searchParams.get("token");
      if (q) return q.trim();
      const pathMatch = asUrl.pathname.match(/\/invite\/([^/]+)\/?$/i);
      if (pathMatch?.[1]) return decodeURIComponent(pathMatch[1]);
    }
  } catch {
    /* not a URL */
  }

  const pathOnly = value.match(/\/invite\/([^/?#]+)\/?/i);
  if (pathOnly?.[1]) return decodeURIComponent(pathOnly[1]);

  const queryOnly = value.match(/[?&]token=([^&]+)/i);
  if (queryOnly?.[1]) return decodeURIComponent(queryOnly[1]);

  return value.replace(/^["']|["']$/g, "");
}
