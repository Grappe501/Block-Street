export type IdentityLocale = "en" | "es";

const STORAGE_KEY = "itl-locale";

export function getStoredLocale(): IdentityLocale {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "es" ? "es" : "en";
}

export function setStoredLocale(locale: IdentityLocale) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, locale);
    window.dispatchEvent(new Event("itl-locale-change"));
  }
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
  "identity.home": { en: "Our identity", es: "Nuestra identidad" },
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

  "agenda.tonight": { en: "Tonight · 6:00 PM", es: "Esta noche · 6:00 PM" },
  "agenda.title": { en: "Meeting Agenda: Launching ASYON", es: "Agenda de la reunión: Lanzamiento de ASYON" },
  "agenda.duration": { en: "Duration: 30–45 minutes", es: "Duración: 30–45 minutos" },
  "agenda.goal": {
    en: "Goal: Introduce the organization, rally participants, and assign roles to build collective power.",
    es: "Objetivo: Presentar la organización, motivar a lxs participantes y asignar roles para construir poder colectivo.",
  },

  "agenda.s1.title": { en: "1. Introductions", es: "1. Presentaciones" },
  "agenda.s1.a": {
    en: "Chance and Xay (Youth Leaders): Share vision, experience, and passion for organizing young people in politics.",
    es: "Chance y Xay (líderes juveniles): Comparten su visión, experiencia y pasión por organizar a jóvenes en la política.",
  },
  "agenda.s1.b": {
    en: "Politician Guests: Briefly introduce them and their role in supporting this effort.",
    es: "Invitados políticos: Presentación breve y su rol en apoyo a este esfuerzo.",
  },
  "agenda.s1.c": {
    en: "Quick Name and School: Each participant introduces themselves with their name & school (e.g., “Alex, University of Arkansas”).",
    es: "Nombre y escuela: Cada participante se presenta con su nombre y escuela (ej.: “Alex, University of Arkansas”).",
  },

  "agenda.s2.title": { en: "2. Why This Matters", es: "2. Por qué esto importa" },
  "agenda.s2.urgency": { en: "The Urgency", es: "La urgencia" },
  "agenda.s2.urgency.a": {
    en: "We’re at a perfect political cusp. The next elections (2026–2028) have the capability to be decided by young voters. If we organize now, we can influence every seat in the state.",
    es: "Estamos en un momento político decisivo. Las próximas elecciones (2026–2028) pueden decidirse con el voto joven. Si nos organizamos ahora, podemos influir en cada escaño del estado.",
  },
  "agenda.s2.urgency.b": {
    en: "Steve (Overall Organizer) has never seen Arkansas colleges organize like this before. This is our chance to make history.",
    es: "Steve (organizador general) nunca ha visto a los campus de Arkansas organizarse así. Esta es nuestra oportunidad de hacer historia.",
  },
  "agenda.s2.urgency.c": {
    en: "You are the most valuable thing to politicians. Young voters are the largest and most untapped voting bloc by large margin. Politicians need us to win, but we need to organize to demand power in return.",
    es: "Ustedes son lo más valioso para lxs políticxs. El voto joven es el bloque más grande y menos aprovechado. Ellos nos necesitan para ganar; nosotros necesitamos organizarnos para exigir poder a cambio.",
  },
  "agenda.s2.problem": { en: "The Problem", es: "El problema" },
  "agenda.s2.problem.a": {
    en: "More than 50% of the voting population is under 50, but the rules are still made by those over 50. We have the numbers but not the organization to aid ourselves, yet.",
    es: "Más del 50% de la población votante tiene menos de 50 años, pero las reglas aún las hacen quienes tienen más de 50. Tenemos los números, pero todavía no la organización para ayudarnos.",
  },
  "agenda.s2.problem.b": {
    en: "Ballot initiatives and lawmaking are areas where young people can have a massive impact—if we’re united.",
    es: "Las iniciativas en la boleta y la elaboración de leyes son áreas donde lxs jóvenes pueden tener un impacto enorme—si estamos unidos.",
  },
  "agenda.s2.opportunity": { en: "The Opportunity", es: "La oportunidad" },
  "agenda.s2.opportunity.a": {
    en: "Swinging the election for people like Kelly, people like Chris, or whoever we decide has our intentions best in mind. This isn’t about a single candidate. It’s about building team voting power to amplify our voice and demand change.",
    es: "Inclinar la elección hacia personas como Kelly, como Chris, o quien decidamos que mejor representa nuestras intenciones. No se trata de un solo candidato. Se trata de construir poder de voto en equipo para amplificar nuestra voz y exigir cambio.",
  },
  "agenda.s2.opportunity.b": {
    en: "After the election, we can uplift each other and future leaders to run for office in the coming years.",
    es: "Después de la elección, podemos impulsarnos mutuamente y a futuros líderes para postularse a cargos en los próximos años.",
  },

  "agenda.s3.title": { en: "3. How This Works", es: "3. Cómo funciona" },
  "agenda.s3.approach": { en: "Our Approach", es: "Nuestro enfoque" },
  "agenda.s3.approach.body": {
    en: "Every campus or group will be unique. We’re providing resources and support, but every group will shape this to fit their community.",
    es: "Cada campus o grupo será único. Ofrecemos recursos y apoyo, pero cada grupo adaptará esto a su comunidad.",
  },
  "agenda.s3.roles": { en: "Core Roles Needed on Every Campus", es: "Roles clave en cada campus" },
  "agenda.s3.roles.a": {
    en: "Social Media Lead (to grow our network and spread the word)",
    es: "Líder de redes sociales (para crecer la red y difundir el mensaje)",
  },
  "agenda.s3.roles.b": {
    en: "Voter Registration Lead (to ensure our peers are registered and ready to vote)",
    es: "Líder de registro de votantes (para que nuestrxs compañerxs estén registradxs y listxs para votar)",
  },
  "agenda.s3.roles.c": {
    en: "College/Community Lead (to oversee and coordinate efforts locally)",
    es: "Líder de colegio/comunidad (para supervisar y coordinar el trabajo local)",
  },
  "agenda.s3.roles.d": {
    en: "Event Lead (to organize fun, engaging, and informative events)",
    es: "Líder de eventos (para organizar eventos divertidos, atractivos e informativos)",
  },
  "agenda.s3.roles.e": {
    en: "Canvassing/Outreach Lead (to connect with peers and expand our network)",
    es: "Líder de canvassing/alcance (para conectar con compañerxs y expandir la red)",
  },
  "agenda.s3.why": { en: "Why Now?", es: "¿Por qué ahora?" },
  "agenda.s3.why.body": {
    en: "Summer is the best time to organize. Life is less chaotic with school out so we can build momentum before the fall rush. Grinding this next month is essential.",
    es: "El verano es el mejor momento para organizarnos. Con menos caos escolar podemos ganar impulso antes del otoño. Trabajar fuerte este próximo mes es esencial.",
  },

  "agenda.s4.title": { en: "4. What We’re Building", es: "4. Qué estamos construyendo" },
  "agenda.s4.vision": { en: "Our Vision", es: "Nuestra visión" },
  "agenda.s4.vision.a": {
    en: "A social network across the state of young people (16–24) to get engaged, inform their peers, and establish political power.",
    es: "Una red social estatal de jóvenes (16–24) para involucrarse, informar a sus pares y establecer poder político.",
  },
  "agenda.s4.vision.b": { en: "Making politics fun", es: "Hacer la política divertida" },
  "agenda.s4.vision.c": { en: "The Power of 5", es: "El Poder de 5" },
  "agenda.s4.long": { en: "Long-Term Goals", es: "Metas a largo plazo" },
  "agenda.s4.long.a": {
    en: "Set a foundation for organizing young people to run for office in future elections.",
    es: "Sentar las bases para organizar a jóvenes que se postulen a cargos en futuras elecciones.",
  },
  "agenda.s4.long.b": {
    en: "Build soft power to influence local politics and politicians.",
    es: "Construir poder blando para influir en la política local y en lxs políticxs.",
  },
  "agenda.s4.long.c": {
    en: "Ballot initiatives and lawmaking — areas where we can have massive effect.",
    es: "Iniciativas en la boleta y elaboración de leyes — áreas donde podemos tener un efecto enorme.",
  },
  "agenda.s4.long.d": {
    en: "Create a statewide network that prepares young leaders to take on leadership roles everywhere.",
    es: "Crear una red estatal que prepare a líderes jóvenes para asumir roles de liderazgo en todas partes.",
  },
  "agenda.s4.long.e": {
    en: "Build collective power so we can change the government together.",
    es: "Construir poder colectivo para cambiar el gobierno juntos.",
  },

  "agenda.s5.title": { en: "5. Show Them How to Use the Website", es: "5. Mostrar cómo usar el sitio web" },
  "agenda.s5.a": {
    en: "Walk through the website’s features",
    es: "Recorrer las funciones del sitio web",
  },
  "agenda.s5.b": {
    en: "Highlight how they can access materials, training, and support to get started",
    es: "Destacar cómo acceder a materiales, capacitación y apoyo para comenzar",
  },
  "agenda.s5.start": { en: "Start / invite", es: "Inicio / invitar" },
  "agenda.s5.place": { en: "Choose place", es: "Elegir lugar" },
  "agenda.s5.network": { en: "My Network", es: "Mi red" },
  "agenda.s5.directory": { en: "Directory", es: "Directorio" },

  "agenda.s6.title": { en: "6. Next Steps: Meeting Again", es: "6. Próximos pasos: volver a reunirnos" },
  "agenda.s6.a": {
    en: "Tell us what dates you can’t make, and we’ll pick the widest availability.",
    es: "Díganos qué fechas no pueden, y elegiremos la mayor disponibilidad.",
  },
  "agenda.s6.b": {
    en: "Proposed window: July 20–26",
    es: "Ventana propuesta: 20–26 de julio",
  },

  "agenda.s7.title": { en: "7. Name Decision for the Organization", es: "7. Decisión del nombre de la organización" },
  "agenda.s7.body": {
    en: "Optional, if time allows — open the floor to brainstorm names for the organization.",
    es: "Opcional, si hay tiempo — abrir el piso para proponer nombres para la organización.",
  },
};

export function t(key: string, locale: IdentityLocale = "en"): string {
  const entry = IDENTITY_STRINGS[key];
  if (!entry) return key;
  return entry[locale] ?? entry.en;
}
