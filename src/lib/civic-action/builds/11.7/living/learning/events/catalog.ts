/**
 * CAE-11.7-W7 — Learning events
 */
export const LEARNING_EVENT_CATALOG = [
  { event: "learning.started", domain: "learning", description: "Human began a learning activity" },
  { event: "course.completed", domain: "curriculum", description: "Course completed with evidence" },
  { event: "competency.earned", domain: "competency", description: "Competency earned after governed validation" },
  { event: "competency.expired", domain: "competency", description: "Competency or certification expired" },
  { event: "certification.awarded", domain: "certification", description: "Certification awarded by Human governance" },
  { event: "knowledge_gap.detected", domain: "gap", description: "Knowledge or competency gap identified" },
  { event: "mentor.recommended", domain: "mentor", description: "Mentor match recommended not assigned" },
  { event: "simulation.completed", domain: "simulation", description: "Practice simulation completed" },
  { event: "curriculum.updated", domain: "curriculum", description: "Curriculum updated through governance" },
  { event: "learning_plan.created", domain: "plan", description: "Personalized learning plan created" },
  { event: "experience.converted", domain: "experience", description: "Mission experience converted to learning material" },
] as const;
