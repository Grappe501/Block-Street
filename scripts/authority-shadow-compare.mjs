#!/usr/bin/env node
/**
 * CPOS-DURABLE-AUTHORITY-1.2 — JSON/Postgres appointment parity comparison.
 */
import "./h-drive-env.mjs";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const authorityDir = join(process.cwd(), "data", "authority");

async function main() {
  const { loadAppointments } = await import("../src/lib/authority/data.ts");
  const { compareAppointmentParity } = await import("../src/lib/authority/shadow.ts");

  const appointments = loadAppointments();
  const result = await compareAppointmentParity(appointments);

  const status = {
    mode: "json_primary_postgres_shadow",
    appointmentsCompared: result.jsonCount,
    scopeBindingsCompared: appointments.length,
    decisionFixturesCompared: 0,
    decisionMismatches: result.mismatches.length,
    postgresCount: result.postgresCount,
    lastComparedAt: new Date().toISOString(),
    promotionReady: result.mismatches.length === 0 && result.postgresCount > 0,
    mismatches: result.mismatches.slice(0, 20),
  };

  writeFileSync(join(authorityDir, "shadow-parity-status.json"), JSON.stringify(status, null, 2) + "\n");

  console.log("authority shadow compare");
  console.log(`JSON appointments: ${result.jsonCount}`);
  console.log(`Postgres appointments: ${result.postgresCount}`);
  console.log(`Mismatches: ${result.mismatches.length}`);
  for (const m of result.mismatches.slice(0, 10)) {
    console.log(`  ${m.kind} ${m.appointmentId}: ${m.detail}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
