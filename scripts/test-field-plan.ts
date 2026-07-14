/**
 * npm run test:field-plan
 */
import assert from "assert";
import { fieldPlanForPosition } from "../src/lib/position-participation/field-plan";
import {
  fieldPlanDoctrine,
  fieldPlanFrameworkStatus,
  listFieldPlanPhases,
  listIngestedRoleKeys,
} from "../src/lib/field-plan/framework";

assert.strictEqual(fieldPlanFrameworkStatus(), "ingested");
assert.ok(fieldPlanDoctrine().toLowerCase().includes("leave behind"));
assert.strictEqual(listFieldPlanPhases().length, 13);
assert.ok(listIngestedRoleKeys().includes("event_lead"));
assert.ok(listIngestedRoleKeys().includes("registration_lead"));

const fp = fieldPlanForPosition("school:henderson-state::event_lead", "Event purpose");
assert.strictEqual(fp.content_status, "ingested");
assert.ok(!fp.before_event.toLowerCase().includes("will be populated"));
assert.ok(fp.source_reference.toLowerCase().includes("victory field"));

const missing = fieldPlanForPosition("school:x::unknown_role", "x");
assert.strictEqual(missing.content_status, "placeholder");

console.log("field-plan tests passed");
