/**
 * CAE-11.6-W5 — Resource & stewardship services
 */
import { caeId, nowIso } from "../../../../utils";
import type { AssetRecord, BudgetRecord, InventoryItemRecord } from "../data-model";
import {
  getAsset,
  getResourceHealth,
  hasReservationConflict,
  listAssets,
  listBudgets,
  listContracts,
  listExpenses,
  listFacilities,
  listInventory,
  listMaintenance,
  listProcurement,
  listReservations,
  listSpaces,
  listVendors,
  saveAsset,
  saveBudget,
  saveContract,
  saveExpense,
  saveInventoryItem,
  saveMaintenance,
  saveProcurement,
  saveReservation,
  saveResourceHealth,
  saveVendor,
} from "./repository";

const DEFAULT_INSTITUTION = "inst-block-street";

export class ResourceError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export const assetService = {
  list: listAssets,
  get: (resourceId: string) => {
    const asset = getAsset(resourceId);
    if (!asset) throw new ResourceError("ASSET_NOT_FOUND", `Asset ${resourceId} not found`);
    return asset;
  },
  create(input: {
    institution_id: string;
    resource_type: string;
    category: AssetRecord["category"];
    sub_category: string;
    name: string;
    description: string;
    ownership_type: AssetRecord["ownership_type"];
    steward_human_id: string;
    mission_id?: string | null;
    purchase_price?: number | null;
  }) {
    const now = nowIso();
    const asset: AssetRecord = {
      resource_id: caeId("res"),
      institution_id: input.institution_id,
      resource_type: input.resource_type,
      category: input.category,
      sub_category: input.sub_category,
      name: input.name,
      description: input.description,
      status: "available",
      lifecycle: "received",
      serial_number: null,
      asset_tag: null,
      ownership_type: input.ownership_type,
      steward_human_id: input.steward_human_id,
      custodian_human_id: null,
      location_id: null,
      condition: "good",
      purchase_date: now,
      purchase_price: input.purchase_price ?? null,
      replacement_value: input.purchase_price ?? null,
      mission_assignment_id: null,
      mission_id: input.mission_id ?? null,
      created_at: now,
      updated_at: now,
    };
    saveAsset(asset);
    return { asset, event: "asset.created" as const };
  },
  assign(input: { resource_id: string; mission_id: string; custodian_human_id?: string }) {
    const asset = getAsset(input.resource_id);
    if (!asset) throw new ResourceError("ASSET_NOT_FOUND", "Asset not found");
    const updated: AssetRecord = {
      ...asset,
      mission_id: input.mission_id,
      custodian_human_id: input.custodian_human_id ?? asset.custodian_human_id,
      status: "assigned",
      lifecycle: "assigned",
      updated_at: nowIso(),
    };
    saveAsset(updated);
    return { asset: updated, event: "asset.assigned" as const };
  },
  retire(resourceId: string) {
    const asset = getAsset(resourceId);
    if (!asset) throw new ResourceError("ASSET_NOT_FOUND", "Asset not found");
    const updated: AssetRecord = { ...asset, status: "retired", lifecycle: "retired", updated_at: nowIso() };
    saveAsset(updated);
    return { asset: updated, event: "resource.retired" as const };
  },
  transfer(input: { resource_id: string; steward_human_id: string; location_id?: string | null }) {
    const asset = getAsset(input.resource_id);
    if (!asset) throw new ResourceError("ASSET_NOT_FOUND", "Asset not found");
    const updated: AssetRecord = {
      ...asset,
      steward_human_id: input.steward_human_id,
      location_id: input.location_id ?? asset.location_id,
      updated_at: nowIso(),
    };
    saveAsset(updated);
    return { asset: updated, event: "asset.assigned" as const };
  },
};

export const inventoryService = {
  list: listInventory,
  adjust(input: {
    inventory_id: string;
    quantity_delta: number;
    reason: string;
    recorded_by: string;
  }) {
    const items = listInventory(DEFAULT_INSTITUTION);
    const item = items.find((i) => i.inventory_id === input.inventory_id);
    if (!item) throw new ResourceError("INVENTORY_NOT_FOUND", "Inventory item not found");
    const updated: InventoryItemRecord = {
      ...item,
      quantity: Math.max(0, item.quantity + input.quantity_delta),
      updated_at: nowIso(),
    };
    saveInventoryItem(updated);
    return { item: updated, event: "inventory.adjusted" as const, reason: input.reason };
  },
  forecastShortages(institutionId: string) {
    return listInventory(institutionId)
      .filter((i) => i.quantity <= i.reorder_threshold)
      .map((i) => ({ inventory_id: i.inventory_id, name: i.name, quantity: i.quantity, threshold: i.reorder_threshold }));
  },
};

export const facilityService = {
  list: listFacilities,
  spaces: listSpaces,
};

export const spaceService = {
  list: listSpaces,
};

export const reservationService = {
  list: listReservations,
  reserve(input: {
    resource_id: string;
    institution_id: string;
    human_id: string;
    mission_id?: string | null;
    start_time: string;
    end_time: string;
    priority?: "low" | "normal" | "high" | "critical";
  }) {
    if (hasReservationConflict(input.resource_id, input.start_time, input.end_time)) {
      throw new ResourceError("RESERVATION_CONFLICT", "Resource already reserved for this time");
    }
    const record = {
      reservation_id: caeId("rsv"),
      resource_id: input.resource_id,
      institution_id: input.institution_id,
      human_id: input.human_id,
      mission_id: input.mission_id ?? null,
      start_time: input.start_time,
      end_time: input.end_time,
      approval_status: "approved" as const,
      priority: input.priority ?? "normal",
      status: "scheduled" as const,
      created_at: nowIso(),
    };
    saveReservation(record);
    const asset = getAsset(input.resource_id);
    if (asset) saveAsset({ ...asset, status: "reserved", lifecycle: "reserved", updated_at: nowIso() });
    return { reservation: record, event: "asset.reserved" as const };
  },
  release(reservationId: string) {
    const reservations = listReservations(DEFAULT_INSTITUTION);
    const reservation = reservations.find((r) => r.reservation_id === reservationId);
    if (!reservation) throw new ResourceError("RESERVATION_NOT_FOUND", "Reservation not found");
    const updated = { ...reservation, status: "cancelled" as const };
    saveReservation(updated);
    const asset = getAsset(reservation.resource_id);
    if (asset && asset.status === "reserved") {
      saveAsset({ ...asset, status: "available", lifecycle: "in_service", updated_at: nowIso() });
    }
    return { reservation: updated, event: "asset.released" as const };
  },
};

export const budgetService = {
  list: listBudgets,
  updateSpent(budgetId: string, amount: number) {
    const budgets = listBudgets(DEFAULT_INSTITUTION);
    const budget = budgets.find((b) => b.budget_id === budgetId);
    if (!budget) throw new ResourceError("BUDGET_NOT_FOUND", "Budget not found");
    const spent = budget.spent + amount;
    const updated: BudgetRecord = {
      ...budget,
      spent,
      remaining: budget.allocated - spent - budget.committed,
    };
    saveBudget(updated);
    return { budget: updated, event: "budget.updated" as const };
  },
};

export const expenseService = {
  list: listExpenses,
  record(input: {
    institution_id: string;
    mission_id?: string | null;
    budget_id: string;
    amount: number;
    description: string;
    vendor_id?: string | null;
    funding_source: Parameters<typeof saveExpense>[0]["funding_source"];
    recorded_by: string;
  }) {
    const expense = {
      expense_id: caeId("exp"),
      institution_id: input.institution_id,
      mission_id: input.mission_id ?? null,
      program_id: null,
      vendor_id: input.vendor_id ?? null,
      budget_id: input.budget_id,
      amount: input.amount,
      description: input.description,
      receipt_reference: null,
      approval_status: "approved" as const,
      funding_source: input.funding_source,
      recorded_by: input.recorded_by,
      recorded_at: nowIso(),
    };
    saveExpense(expense);
    budgetService.updateSpent(input.budget_id, input.amount);
    return { expense, event: "expense.recorded" as const };
  },
};

export const procurementService = {
  list: listProcurement,
  request(input: {
    institution_id: string;
    mission_id?: string | null;
    objective_id?: string | null;
    item_description: string;
    estimated_cost: number;
    budget_id: string;
    requested_by: string;
  }) {
    const record = {
      procurement_id: caeId("prc"),
      institution_id: input.institution_id,
      mission_id: input.mission_id ?? null,
      objective_id: input.objective_id ?? null,
      item_description: input.item_description,
      estimated_cost: input.estimated_cost,
      budget_id: input.budget_id,
      status: "requested" as const,
      requested_by: input.requested_by,
      approved_by: null,
      created_at: nowIso(),
    };
    saveProcurement(record);
    return { procurement: record, event: "asset.created" as const };
  },
  approve(procurementId: string, approvedBy: string) {
    const items = listProcurement(DEFAULT_INSTITUTION);
    const item = items.find((p) => p.procurement_id === procurementId);
    if (!item) throw new ResourceError("PROCUREMENT_NOT_FOUND", "Procurement not found");
    const updated = { ...item, status: "approved" as const, approved_by: approvedBy };
    saveProcurement(updated);
    return updated;
  },
};

export const vendorService = {
  list: listVendors,
  create(input: { institution_id: string; organization_name: string; services: string[] }) {
    const record = {
      vendor_id: caeId("ven"),
      institution_id: input.institution_id,
      organization_name: input.organization_name,
      contacts: [],
      services: input.services,
      compliance_status: "review_needed" as const,
      performance_score: 0.5,
      created_at: nowIso(),
    };
    saveVendor(record);
    return { vendor: record, event: "vendor.created" as const };
  },
};

export const contractService = {
  list: listContracts,
  create(input: {
    institution_id: string;
    vendor_id: string;
    title: string;
    renewal_date?: string | null;
    obligations?: string[];
  }) {
    const record = {
      contract_id: caeId("ctr"),
      institution_id: input.institution_id,
      vendor_id: input.vendor_id,
      title: input.title,
      renewal_date: input.renewal_date ?? null,
      obligations: input.obligations ?? [],
      insurance_verified: false,
      compliance_status: "active" as const,
      payment_schedule: "monthly",
    };
    saveContract(record);
    return record;
  },
  expiring(institutionId: string, withinDays = 30) {
    const cutoff = Date.now() + withinDays * 86400000;
    return listContracts(institutionId).filter((c) => c.renewal_date && new Date(c.renewal_date).getTime() <= cutoff);
  },
};

export const maintenanceService = {
  list: listMaintenance,
  schedule(input: {
    resource_id: string;
    institution_id: string;
    maintenance_type: Parameters<typeof saveMaintenance>[0]["maintenance_type"];
    scheduled_date: string;
    description: string;
    recorded_by: string;
  }) {
    const asset = getAsset(input.resource_id);
    if (!asset) throw new ResourceError("ASSET_NOT_FOUND", "Asset not found");
    const record = {
      maintenance_id: caeId("mnt"),
      resource_id: input.resource_id,
      institution_id: input.institution_id,
      maintenance_type: input.maintenance_type,
      scheduled_date: input.scheduled_date,
      completed_date: null,
      status: "scheduled" as const,
      description: input.description,
      parts: [],
      condition_before: asset.condition,
      condition_after: null,
      recorded_by: input.recorded_by,
    };
    saveMaintenance(record);
    saveAsset({ ...asset, status: "maintenance", lifecycle: "maintenance", updated_at: nowIso() });
    return { maintenance: record, event: "maintenance.scheduled" as const };
  },
  complete(maintenanceId: string, conditionAfter: string) {
    const items = listMaintenance(DEFAULT_INSTITUTION);
    const item = items.find((m) => m.maintenance_id === maintenanceId);
    if (!item) throw new ResourceError("MAINTENANCE_NOT_FOUND", "Maintenance not found");
    const updated = {
      ...item,
      status: "completed" as const,
      completed_date: nowIso(),
      condition_after: conditionAfter,
    };
    saveMaintenance(updated);
    const asset = getAsset(item.resource_id);
    if (asset) {
      saveAsset({
        ...asset,
        status: "available",
        lifecycle: "in_service",
        condition: conditionAfter as AssetRecord["condition"],
        updated_at: nowIso(),
      });
    }
    return { maintenance: updated, event: "maintenance.completed" as const };
  },
};

export const fleetService = {
  listVehicles(institutionId: string) {
    return listAssets(institutionId).filter((a) => a.category === "vehicles");
  },
  missionHistory(resourceId: string) {
    const asset = getAsset(resourceId);
    if (!asset) return [];
    return asset.mission_id ? [{ mission_id: asset.mission_id, assigned_at: asset.updated_at }] : [];
  },
};

export const digitalAssetService = {
  list(institutionId: string) {
    return listAssets(institutionId).filter((a) => a.category === "digital_assets" || a.resource_type === "document");
  },
};

export const resourceHealthService = {
  compute(resourceId: string) {
    const asset = getAsset(resourceId);
    if (!asset) throw new ResourceError("ASSET_NOT_FOUND", "Asset not found");
    const conditionMap = { excellent: 1, good: 0.8, fair: 0.6, poor: 0.4, critical: 0.2 };
    const record = {
      health_id: caeId("rht"),
      resource_id: resourceId,
      institution_id: asset.institution_id,
      condition_score: conditionMap[asset.condition],
      reliability_score: asset.lifecycle === "in_service" ? 0.85 : 0.5,
      utilization_score: asset.status === "assigned" ? 0.9 : 0.4,
      maintenance_risk: asset.status === "maintenance" ? 0.7 : 0.2,
      replacement_risk: asset.purchase_price && asset.replacement_value
        ? Math.max(0, 1 - asset.replacement_value / asset.purchase_price)
        : 0.3,
      mission_criticality: asset.mission_id ? 0.9 : 0.3,
      computed_at: nowIso(),
    };
    saveResourceHealth(record);
    return record;
  },
  get: getResourceHealth,
};

export const aiResourceAdvisorService = {
  analyze(institutionId: string) {
    const assets = listAssets(institutionId);
    const budgets = listBudgets(institutionId);
    const shortages = inventoryService.forecastShortages(institutionId);
    const expiring = contractService.expiring(institutionId);
    return {
      institution_id: institutionId,
      advisory_only: true,
      may_not_purchase_autonomously: true,
      recommendations: [
        shortages.length > 0 ? `Replenish ${shortages.length} inventory items below threshold` : null,
        expiring.length > 0 ? `Review ${expiring.length} expiring contracts` : null,
        assets.filter((a) => a.condition === "poor" || a.condition === "critical").length > 0
          ? "Schedule maintenance for assets in poor condition"
          : null,
      ].filter(Boolean),
      budget_forecast: budgets.map((b) => ({ budget_id: b.budget_id, remaining: b.remaining, forecast: b.forecast })),
      duplicate_purchase_warnings: [],
      facility_utilization: listFacilities(institutionId).length,
    };
  },
};

export const executiveResourceDashboardService = {
  build(institutionId: string) {
    const budgets = listBudgets(institutionId);
    const assets = listAssets(institutionId);
    const inventory = listInventory(institutionId);
    const maintenance = listMaintenance(institutionId).filter((m) => m.status === "scheduled");
    return {
      institution_id: institutionId,
      budget_health: budgets.map((b) => ({ name: b.name, remaining: b.remaining, allocated: b.allocated })),
      asset_health: assets.map((a) => resourceHealthService.compute(a.resource_id)),
      facility_utilization: listFacilities(institutionId),
      inventory_summary: { items: inventory.length, low_stock: inventoryService.forecastShortages(institutionId).length },
      upcoming_maintenance: maintenance,
      mission_resource_needs: assets.filter((a) => a.mission_id).length,
      advisory_only: true,
    };
  },
};

export const resourceService = {
  assets: assetService,
  inventory: inventoryService,
  facilities: facilityService,
  spaces: spaceService,
  reservations: reservationService,
  budgets: budgetService,
  expenses: expenseService,
  procurement: procurementService,
  vendors: vendorService,
  contracts: contractService,
  maintenance: maintenanceService,
  fleet: fleetService,
  digitalAssets: digitalAssetService,
  health: resourceHealthService,
  ai: aiResourceAdvisorService,
  executiveDashboard: executiveResourceDashboardService,
};
