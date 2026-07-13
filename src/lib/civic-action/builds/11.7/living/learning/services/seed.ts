/**
 * CAE-11.7-W7 — Seed learning defaults
 */
import { seedConversationIfEmpty } from "../../conversation/services/seed";
import { readStoreSlice } from "./repository";
import { LEARNING_STORE_KEYS } from "../data-model";
import { learningRuntime } from "./learning-service";

const HUMAN = "usr-001";
const INSTITUTION = "inst-block-street";

export function seedLearningIfEmpty() {
  seedConversationIfEmpty();
  if (readStoreSlice(LEARNING_STORE_KEYS.competencies).length > 0) return false;

  const organizing = learningRuntime.competencies.register({
    institution_id: INSTITUTION,
    name: "Community Organizing",
    description: "Lead community engagement and volunteer coordination.",
    domain: "community_organizing",
    difficulty: "intermediate",
    governance_owner: "curriculum-committee",
  });

  const grants = learningRuntime.competencies.register({
    institution_id: INSTITUTION,
    name: "Grant Writing",
    description: "Prepare evidence-based grant applications.",
    domain: "grant_writing",
    governance_owner: "curriculum-committee",
  });

  learningRuntime.university.provision(INSTITUTION, "Block Street Civic University");

  learningRuntime.curriculum.createCourse({
    human_id: HUMAN,
    institution_id: INSTITUTION,
    title: "County Immersion Fundamentals",
    curriculum_type: "course",
    learning_objective: "Prepare organizers for county-level civic engagement.",
    competencies: [organizing.competency.competency_id],
    governance_owner: "curriculum-committee",
  });

  learningRuntime.plans.create({
    human_id: HUMAN,
    institution_id: INSTITUTION,
    role_context: "Executive Director",
    goals: ["Strengthen county immersion program", "Improve grant readiness"],
    competency_gaps: [grants.competency.competency_id],
    language: "en",
  });

  learningRuntime.gaps.detect({
    human_id: HUMAN,
    institution_id: INSTITUTION,
    gap_type: "competency",
    subject: "Legislative analysis",
    description: "HB-214 impact analysis competency not yet demonstrated.",
    priority: "high",
  });

  learningRuntime.mentors.recommend({
    human_id: HUMAN,
    institution_id: INSTITUTION,
    mentor_human_id: "usr-003",
    expertise: ["volunteer_management", "community_organizing"],
    reason: "Experienced organizer for county immersion mentorship.",
  });

  learningRuntime.experience.convert({
    mission_id: "msn-block-street-001",
    institution_id: INSTITUTION,
    human_id: HUMAN,
    lessons_learned: ["Early partner alignment reduces timeline risk", "County match verification is critical"],
    case_study: "County Immersion Launch — volunteer coordination lessons",
  });

  learningRuntime.competencyGraph.link({
    institution_id: INSTITUTION,
    node_type: "competency",
    label: "Community Organizing",
    reference_id: organizing.competency.competency_id,
    linked_nodes: ["msn-block-street-001"],
  });

  return true;
}
