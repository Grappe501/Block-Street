import assert from "assert";
import persist from "../data/v2/production-persistence-forensic-audit.json";

assert.strictEqual(persist.netlify_database_postgres_active, false);
assert.ok(
  String(persist.canonical_persistence_backend).includes("blobs") ||
    String(persist.canonical_persistence_backend).includes("seed"),
);
assert.ok(Array.isArray(persist.actions) && persist.actions.length >= 15);
assert.ok(persist.do_not_claim?.includes("Everything is stored"));
assert.ok(persist.do_not_claim?.includes("Postgres is live"));

const backends = new Set(persist.actions.map((a) => a.storage_backend));
assert.ok(backends.has("not_persisted"));
assert.ok([...backends].every((b) => typeof b === "string" && b.length > 0));

console.log("persistence-audit tests passed");
