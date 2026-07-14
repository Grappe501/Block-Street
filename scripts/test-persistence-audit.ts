import assert from "assert";
import persist from "../data/v2/production-persistence-forensic-audit.json";

assert.strictEqual(persist.netlify_database_postgres_active, false);
assert.ok(String(persist.canonical_persistence_backend).includes("blobs") || String(persist.canonical_persistence_backend).includes("seed"));
assert.ok(Array.isArray(persist.actions) && persist.actions.length >= 3);
console.log("persistence-audit tests passed");
