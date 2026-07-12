import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import {
  getWave3Overview,
  runWave3Certification,
} from "@/lib/identity-trust/wave3/engine";
import { reconcileWave2ToWave3 } from "@/lib/identity-trust/wave3/migration";
import {
  assignCaseReviewer,
  listAllCases,
} from "@/lib/identity-trust/wave3/cases";
import {
  enterCaseDecision,
  sendCaseNotice,
} from "@/lib/identity-trust/wave3/decisions";
import { applyContainment, liftContainment } from "@/lib/identity-trust/wave3/containment";
import {
  approveDuplicateMerge,
  executeDuplicateMerge,
  getMergePreview,
} from "@/lib/identity-trust/wave3/duplicates";
import { decideIdentityAppeal, listAllAppeals } from "@/lib/identity-trust/wave3/appeals";
import { approveRestoration } from "@/lib/identity-trust/wave3/restoration";
import { loadDuplicateIdentityCases } from "@/lib/identity-trust/wave3/data";

export const GET = withAdmin((ctx) => {
  reconcileWave2ToWave3(ctx.user_id);
  return NextResponse.json({
    overview: getWave3Overview(),
    certification: runWave3Certification(),
    cases: listAllCases(),
    appeals: listAllAppeals(),
    duplicates: loadDuplicateIdentityCases(),
  });
});

export const POST = withAdmin(async (ctx, request) => {
  const body = (await request.json()) as Record<string, unknown>;
  const action = body.action as string;

  switch (action) {
    case "assign":
      return NextResponse.json(assignCaseReviewer(body.case_id as string, body.reviewer_id as string, ctx.user_id));
    case "notice":
      return NextResponse.json(
        sendCaseNotice({
          case_id: body.case_id as string,
          subject_human_id: body.subject_human_id as string,
          summary: body.summary as string,
          restrictions: body.restrictions as string | undefined,
        })
      );
    case "contain":
      return NextResponse.json(
        applyContainment({
          case_id: body.case_id as string,
          subject_human_id: body.subject_human_id as string,
          action_type: body.containment_type as string,
          scope: (body.scope as string) ?? "institution_membership",
          reason: body.reason as string,
          authorized_by: ctx.user_id,
        })
      );
    case "lift_containment":
      return NextResponse.json(liftContainment(body.containment_id as string, ctx.user_id));
    case "decide":
      return NextResponse.json(
        enterCaseDecision({
          case_id: body.case_id as string,
          decided_by: ctx.user_id,
          decision_type: body.decision_type as string,
          findings: body.findings as string,
          governing_rules: (body.governing_rules as string[]) ?? ["ITL-W3-001"],
          evidence_summary: body.evidence_summary as string,
          evidence_limitations: (body.evidence_limitations as string) ?? "",
          decision: body.decision as string,
          conditions: body.conditions as string | undefined,
        })
      );
    case "merge_preview":
      return NextResponse.json(getMergePreview(body.duplicate_case_id as string));
    case "approve_merge":
      return NextResponse.json(approveDuplicateMerge(body.duplicate_case_id as string, ctx.user_id));
    case "execute_merge":
      return NextResponse.json(executeDuplicateMerge(body.duplicate_case_id as string, ctx.user_id));
    case "decide_appeal":
      return NextResponse.json(
        decideIdentityAppeal({
          appeal_id: body.appeal_id as string,
          decider_id: ctx.user_id,
          outcome: body.outcome as "granted" | "granted_in_part" | "denied" | "remanded",
          findings: body.findings as string,
        })
      );
    case "restore":
      return NextResponse.json(approveRestoration(body.request_id as string, ctx.user_id, Boolean(body.provisional)));
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
});
