export type IdentityLocale = "en" | "es";

const STORAGE_KEY = "itl-locale";

export function getStoredLocale(): IdentityLocale {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "es" ? "es" : "en";
}

export function setStoredLocale(locale: IdentityLocale) {
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, locale);
}

type Strings = Record<string, { en: string; es: string }>;

export const IDENTITY_STRINGS: Strings = {
  "join.title": {
    en: "This is a closed, invitation-only platform.",
    es: "Esta es una plataforma cerrada, solo por invitación.",
  },
  "join.body": {
    en: "Every account represents one identifiable Human. To enter, a current member must invite you and accept responsibility for knowing or directly verifying who you are.",
    es: "Cada cuenta representa a una persona identificable. Para entrar, un miembro actual debe invitarte y aceptar la responsabilidad de conocerte o verificar directamente quién eres.",
  },
  "join.have_invitation": { en: "I Have an Invitation", es: "Tengo una invitación" },
  "join.sign_in": { en: "Sign In to an Existing Account", es: "Iniciar sesión con cuenta existente" },
  "join.learn": { en: "Learn How Invitations Work", es: "Cómo funcionan las invitaciones" },
  "join.support": { en: "Get Identity Support", es: "Obtener ayuda de identidad" },
  "join.july14_entry": { en: "Enter the July 14 Organizing Platform", es: "Entrar a la plataforma del 14 de julio" },
  "invite.title": { en: "Accept invitation", es: "Aceptar invitación" },
  "invite.public_name": { en: "Public Human name", es: "Nombre público como persona" },
  "invite.public_name_hint": {
    en: "Use the name you are publicly known by — not a username or slogan.",
    es: "Usa el nombre por el que te conocen públicamente — no un usuario ni un eslogan.",
  },
  "invite.activate": { en: "Activate identity", es: "Activar identidad" },
  "identity.home": { en: "Your identity", es: "Tu identidad" },
  "identity.verified_human": { en: "Verified Human", es: "Persona verificada" },
  "identity.sponsored": { en: "Sponsored", es: "Patrocinada" },
  "identity.next_action": { en: "My next action", es: "Mi siguiente paso" },
  "identity.my_identity": { en: "My Identity", es: "Mi identidad" },
  "identity.my_memberships": { en: "My Memberships", es: "Mis membresías" },
  "identity.my_verification": { en: "My Verification", es: "Mi verificación" },
  "identity.my_lineage": { en: "My Invitation Lineage", es: "Mi linaje de invitación" },
  "identity.my_invitations": { en: "My Invitations", es: "Mis invitaciones" },
  "identity.my_timeline": { en: "My Timeline", es: "Mi línea de tiempo" },
  "verification.title": { en: "Identity verification", es: "Verificación de identidad" },
  "verification.request": { en: "Request Verification", es: "Solicitar verificación" },
  "verification.confirm": { en: "Confirm", es: "Confirmar" },
  "verification.unable": { en: "Unable to confirm", es: "No puedo confirmar" },
  "sponsor.title": { en: "Sponsor dashboard", es: "Panel de patrocinador" },
  "sponsor.invite": { en: "Invite a Human I Know", es: "Invitar a alguien que conozco" },
  "july14.welcome": { en: "Welcome", es: "Bienvenido" },
  "july14.entering_as": { en: "You are entering as a", es: "Estás entrando como" },
  "july14.meeting": { en: "Current Meeting", es: "Reunión actual" },
  "july14.demo_record": { en: "Demonstration Record", es: "Registro de demostración" },
  "july14.locked": { en: "Coming later", es: "Próximamente" },
  "institution.current": { en: "Current Institution", es: "Institución actual" },
  "lang.english": { en: "English", es: "English" },
  "lang.spanish": { en: "Español", es: "Español" },
};

export function t(key: string, locale: IdentityLocale = "en"): string {
  const entry = IDENTITY_STRINGS[key];
  if (!entry) return key;
  return entry[locale] ?? entry.en;
}
