const ALLOWED_ACTION_DOMAINS = ["block-street.local", "localhost", ""];

export function isSafeActionUrl(url: string | null | undefined): boolean {
  if (!url) return true;
  if (url.startsWith("/")) return !url.includes("//");
  try {
    const parsed = new URL(url, "https://block-street.local");
    return ALLOWED_ACTION_DOMAINS.some((d) => parsed.hostname === d || parsed.hostname.endsWith(`.${d}`));
  } catch {
    return false;
  }
}

export function renderTemplate(template: string, variables: Record<string, string>): string {
  return template.replace(/\{\{([^}]+)\}\}/g, (_, key: string) => {
    const k = key.trim();
    if (!(k in variables)) return "";
    return String(variables[k]).replace(/[<>&"']/g, "");
  });
}

export function validateTemplateVariables(
  template: { required_variables: string[]; allowed_variables: string[] },
  variables: Record<string, string>
): string | null {
  for (const req of template.required_variables) {
    if (!variables[req]) return `Missing required variable: ${req}`;
  }
  for (const key of Object.keys(variables)) {
    if (!template.allowed_variables.includes(key) && template.required_variables.includes(key) === false) {
      const allowed = new Set([...template.allowed_variables, ...template.required_variables]);
      if (!allowed.has(key)) return `Variable not allowed: ${key}`;
    }
  }
  return null;
}
