import assignmentFixtures from "../../../../data/calendar/assignment-test-fixtures.json";
import offerFixtures from "../../../../data/calendar/offer-test-fixtures.json";
import { seedAssignmentsFixtures, listOffers } from "./store";

let initialized = false;

export function ensureAssignmentDemoFixtures(): void {
  if (initialized || listOffers().length > 0) return;
  seedAssignmentsFixtures({
    reviews: assignmentFixtures.reviews as import("./types").CalendarVolunteerReview[],
    offers: offerFixtures.offers as import("./types").CalendarShiftOffer[],
    assignments: assignmentFixtures.assignments as import("./types").CalendarShiftAssignment[],
    waitlists: assignmentFixtures.waitlists as import("./types").CalendarShiftWaitlistEntry[],
    cancellations: assignmentFixtures.cancellations as import("./types").CalendarAssignmentCancellation[],
    replacementNeeds: assignmentFixtures.replacementNeeds as import("./types").CalendarReplacementNeed[],
  });
  initialized = true;
}
