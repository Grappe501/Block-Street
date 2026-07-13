/**
 * CAE-11.6-W5 — Resource persistence
 */
export { readStoreSlice, writeStoreSlice } from "../../../11.1/services/repository";
import { readStoreSlice, writeStoreSlice } from "../../../11.1/services/repository";
import type {
  AssetRecord,
  BudgetRecord,
  ContractRecord,
  ExpenseRecord,
  FacilityRecord,
  InventoryItemRecord,
  MaintenanceRecord,
  ProcurementRequestRecord,
  ReservationRecord,
  ResourceHealthRecord,
  SpaceRecord,
  VendorRecord,
} from "../data-model";
import { RESOURCE_STORE_KEYS } from "../data-model";

function upsertById<T>(key: string, record: T, idField: keyof T & string) {
  const items = readStoreSlice<T>(key);
  const id = String(record[idField]);
  const idx = items.findIndex((i) => String(i[idField]) === id);
  if (idx >= 0) items[idx] = record;
  else items.push(record);
  writeStoreSlice(key, items);
}

export function listAssets(institutionId: string, missionId?: string) {
  return readStoreSlice<AssetRecord>(RESOURCE_STORE_KEYS.assets).filter(
    (a) => a.institution_id === institutionId && (!missionId || a.mission_id === missionId)
  );
}

export function getAsset(resourceId: string) {
  return readStoreSlice<AssetRecord>(RESOURCE_STORE_KEYS.assets).find((a) => a.resource_id === resourceId) ?? null;
}

export function saveAsset(record: AssetRecord) {
  upsertById(RESOURCE_STORE_KEYS.assets, record, "resource_id");
}

export function listFacilities(institutionId: string) {
  return readStoreSlice<FacilityRecord>(RESOURCE_STORE_KEYS.facilities).filter((f) => f.institution_id === institutionId);
}

export function saveFacility(record: FacilityRecord) {
  upsertById(RESOURCE_STORE_KEYS.facilities, record, "facility_id");
}

export function listSpaces(institutionId: string, facilityId?: string) {
  return readStoreSlice<SpaceRecord>(RESOURCE_STORE_KEYS.spaces).filter(
    (s) => s.institution_id === institutionId && (!facilityId || s.facility_id === facilityId)
  );
}

export function saveSpace(record: SpaceRecord) {
  upsertById(RESOURCE_STORE_KEYS.spaces, record, "space_id");
}

export function listReservations(institutionId: string, resourceId?: string) {
  return readStoreSlice<ReservationRecord>(RESOURCE_STORE_KEYS.reservations).filter(
    (r) => r.institution_id === institutionId && (!resourceId || r.resource_id === resourceId)
  );
}

export function saveReservation(record: ReservationRecord) {
  upsertById(RESOURCE_STORE_KEYS.reservations, record, "reservation_id");
}

export function listInventory(institutionId: string) {
  return readStoreSlice<InventoryItemRecord>(RESOURCE_STORE_KEYS.inventory).filter((i) => i.institution_id === institutionId);
}

export function saveInventoryItem(record: InventoryItemRecord) {
  upsertById(RESOURCE_STORE_KEYS.inventory, record, "inventory_id");
}

export function listBudgets(institutionId: string, scopeId?: string) {
  return readStoreSlice<BudgetRecord>(RESOURCE_STORE_KEYS.budgets).filter(
    (b) => b.institution_id === institutionId && (!scopeId || b.scope_id === scopeId)
  );
}

export function saveBudget(record: BudgetRecord) {
  upsertById(RESOURCE_STORE_KEYS.budgets, record, "budget_id");
}

export function listExpenses(institutionId: string, missionId?: string) {
  return readStoreSlice<ExpenseRecord>(RESOURCE_STORE_KEYS.expenses).filter(
    (e) => e.institution_id === institutionId && (!missionId || e.mission_id === missionId)
  );
}

export function saveExpense(record: ExpenseRecord) {
  upsertById(RESOURCE_STORE_KEYS.expenses, record, "expense_id");
}

export function listVendors(institutionId: string) {
  return readStoreSlice<VendorRecord>(RESOURCE_STORE_KEYS.vendors).filter((v) => v.institution_id === institutionId);
}

export function saveVendor(record: VendorRecord) {
  upsertById(RESOURCE_STORE_KEYS.vendors, record, "vendor_id");
}

export function listContracts(institutionId: string) {
  return readStoreSlice<ContractRecord>(RESOURCE_STORE_KEYS.contracts).filter((c) => c.institution_id === institutionId);
}

export function saveContract(record: ContractRecord) {
  upsertById(RESOURCE_STORE_KEYS.contracts, record, "contract_id");
}

export function listMaintenance(institutionId: string, resourceId?: string) {
  return readStoreSlice<MaintenanceRecord>(RESOURCE_STORE_KEYS.maintenance).filter(
    (m) => m.institution_id === institutionId && (!resourceId || m.resource_id === resourceId)
  );
}

export function saveMaintenance(record: MaintenanceRecord) {
  upsertById(RESOURCE_STORE_KEYS.maintenance, record, "maintenance_id");
}

export function listProcurement(institutionId: string) {
  return readStoreSlice<ProcurementRequestRecord>(RESOURCE_STORE_KEYS.procurement).filter((p) => p.institution_id === institutionId);
}

export function saveProcurement(record: ProcurementRequestRecord) {
  upsertById(RESOURCE_STORE_KEYS.procurement, record, "procurement_id");
}

export function getResourceHealth(resourceId: string) {
  return readStoreSlice<ResourceHealthRecord>(RESOURCE_STORE_KEYS.resource_health).find((h) => h.resource_id === resourceId) ?? null;
}

export function saveResourceHealth(record: ResourceHealthRecord) {
  upsertById(RESOURCE_STORE_KEYS.resource_health, record, "health_id");
}

export function hasReservationConflict(resourceId: string, startTime: string, endTime: string, excludeId?: string) {
  const reservations = readStoreSlice<ReservationRecord>(RESOURCE_STORE_KEYS.reservations).filter(
    (r) => r.resource_id === resourceId && r.status !== "cancelled" && r.reservation_id !== excludeId
  );
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  return reservations.some((r) => {
    const rStart = new Date(r.start_time).getTime();
    const rEnd = new Date(r.end_time).getTime();
    return start < rEnd && end > rStart;
  });
}
