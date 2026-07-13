/**
 * CAE-11.12-W4 — EN/ES strings for Learning Workbench
 */
type Locale = "en" | "es";

const EN: Record<string, string> = {
  "home.title": "My Learning",
  "home.subtitle": "Know what to do next — knowledge, practice, and growth connected.",
  "home.primary_question": "What is the most important thing for me to do right now?",
  "home.empty.title": "Your learning journey starts here.",
  "home.empty.body": "Browse the knowledge library or enroll in a course to begin.",
  "home.empty.action": "Explore Learning",
  "nav.home": "Home",
  "nav.mission": "Mission",
  "nav.knowledge": "Knowledge",
  "nav.learning": "Learning",
  "nav.practice": "Practice",
  "nav.competencies": "Competencies",
  "nav.certifications": "Certifications",
  "nav.research": "Research",
  "nav.community": "Community",
  "nav.settings": "Settings",
  "role.learner": "Learner",
  "role.volunteer": "Volunteer",
  "role.instructor": "Instructor",
  "role.knowledge_steward": "Knowledge Steward",
  "role.executive": "Executive",
  "role.administrator": "Administrator",
  "banner.historical": "You are viewing a historical version. Current version available.",
  "competency.note": "Course completion alone does not demonstrate competency.",
  "certification.note": "Certification requires explicit eligibility and Human authority.",
  "tutor.advisory": "AI Tutor provides guidance — not final authority.",
  "error.permission.title": "You can view this content but cannot change institutional records here.",
  "error.permission.body": "Ask a steward, instructor, or administrator for the access you need.",
  "search.placeholder": "Search knowledge, courses, competencies, certifications…",
  "a11y.nav.label": "Learning workbench sections",
  "a11y.context.label": "Related context panel",
  "es.progress.prompt": "¿Qué debería hacer ahora?",
  "es.tutor.prompt": "Explícame esto en español sencillo.",
};

const ES: Record<string, string> = {
  "home.title": "Mi Aprendizaje",
  "home.subtitle": "Sabe qué hacer después — conocimiento, práctica y crecimiento conectados.",
  "home.primary_question": "¿Qué es lo más importante que debo hacer ahora?",
  "home.empty.title": "Tu camino de aprendizaje empieza aquí.",
  "home.empty.body": "Explora la biblioteca de conocimiento o inscríbete en un curso.",
  "home.empty.action": "Explorar Aprendizaje",
  "nav.home": "Inicio",
  "nav.mission": "Misión",
  "nav.knowledge": "Conocimiento",
  "nav.learning": "Aprendizaje",
  "nav.practice": "Práctica",
  "nav.competencies": "Competencias",
  "nav.certifications": "Certificaciones",
  "nav.research": "Investigación",
  "nav.community": "Comunidad",
  "nav.settings": "Configuración",
  "role.learner": "Aprendiz",
  "role.volunteer": "Voluntario",
  "role.instructor": "Instructor",
  "role.knowledge_steward": "Custodio de Conocimiento",
  "role.executive": "Ejecutivo",
  "role.administrator": "Administrador",
  "banner.historical": "Estás viendo una versión histórica. Versión actual disponible.",
  "competency.note": "Completar un curso no demuestra competencia por sí solo.",
  "certification.note": "La certificación requiere elegibilidad explícita y autoridad humana.",
  "tutor.advisory": "El tutor de IA orienta — no es autoridad final.",
  "error.permission.title": "Puedes ver este contenido pero no cambiar registros institucionales aquí.",
  "error.permission.body": "Pide acceso a un custodio, instructor o administrador.",
  "search.placeholder": "Busca conocimiento, cursos, competencias, certificaciones…",
  "a11y.nav.label": "Secciones del banco de aprendizaje",
  "a11y.context.label": "Panel de contexto relacionado",
  "es.progress.prompt": "¿Qué debería hacer ahora?",
  "es.tutor.prompt": "Explícame esto en español sencillo.",
};

export function t(locale: Locale, key: string, ...args: string[]): string {
  const table = locale === "es" ? ES : EN;
  let s = table[key] ?? EN[key] ?? key;
  args.forEach((a, i) => {
    s = s.replace(`{${i}}`, a);
  });
  return s;
}

export const UX_INVARIANTS = [
  "CAE-11.12-W4-UX-001",
  "CAE-11.12-W4-UX-002",
  "CAE-11.12-W4-UX-003",
  "CAE-11.12-W4-UX-004",
  "CAE-11.12-W4-UX-005",
  "CAE-11.12-W4-UX-006",
  "CAE-11.12-W4-UX-007",
  "CAE-11.12-W4-UX-008",
  "CAE-11.12-W4-UX-009",
  "CAE-11.12-W4-UX-010",
] as const;
