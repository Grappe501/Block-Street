import { loadUsers } from "@/lib/auth/data";
import { loadHumanIdentities } from "../data";
import { itlId, nowIso } from "../utils";
import { loadMigrationCertifications, persistMigrationCertifications } from "./data";

export function runMigrationInventory() {
  const users = loadUsers().filter((u) => u.account_status === "active");
  const humans = loadHumanIdentities();
  const humanUserIds = new Set(humans.map((h) => h.user_id));

  const orphans = users.filter((u) => !humanUserIds.has(u.user_id));
  const shared = users.filter((u) => u.display_name?.toLowerCase().includes("team") || u.display_name?.toLowerCase().includes("outreach"));
  const test = users.filter((u) => u.primary_email?.includes("test") || u.primary_email?.includes("example.local"));

  return {
    total_accounts: users.length,
    confirmed_humans: humans.filter((h) => h.identity_status === "active").length,
    duplicate_accounts: 0,
    service_identities: 0,
    shared_accounts: shared.length,
    test_accounts: test.length,
    unknown_accounts: orphans.length,
    active_orphan_accounts: orphans.length,
    classifications: users.map((u) => ({
      user_id: u.user_id,
      classification: humanUserIds.has(u.user_id)
        ? "confirmed_human"
        : u.primary_email?.includes("test") || u.primary_email?.includes("example.local")
          ? "test_identity"
          : shared.some((s) => s.user_id === u.user_id)
            ? "shared_human_account"
            : "unknown_account",
    })),
  };
}

export function validateMigration(certificationId: string) {
  const inventory = runMigrationInventory();
  const passed =
    inventory.active_orphan_accounts === 0 &&
    inventory.shared_accounts === 0 &&
    inventory.test_accounts === 0;

  const record = {
    id: itlId("imc"),
    certification_id: certificationId,
    total_accounts: inventory.total_accounts,
    confirmed_humans: inventory.confirmed_humans,
    duplicate_accounts: inventory.duplicate_accounts,
    service_identities: inventory.service_identities,
    shared_accounts: inventory.shared_accounts,
    test_accounts: inventory.test_accounts,
    unknown_accounts: inventory.unknown_accounts,
    active_orphan_accounts: inventory.active_orphan_accounts,
    passed,
    certified_at: passed ? nowIso() : null,
  };

  const all = loadMigrationCertifications();
  all.push(record);
  persistMigrationCertifications(all);
  return record;
}

export function getMigrationReconciliation() {
  const latest = loadMigrationCertifications().at(-1);
  const inventory = runMigrationInventory();
  return { inventory, latest_certification: latest ?? null };
}
