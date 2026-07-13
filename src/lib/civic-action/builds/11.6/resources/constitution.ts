/**
 * CAE-11.6-W5 — Resource, Asset & Financial Stewardship Constitution (OPS-001)
 */
export const OPS_RESOURCE_PRINCIPLE =
  "Resources exist to accomplish the Institution's mission. Assets are never collected simply to own them.";

export const RESOURCE_ARCHITECTURE = [
  "institution",
  "resource_category",
  "asset",
  "location",
  "reservation",
  "mission_assignment",
  "maintenance",
  "lifecycle",
  "institutional_memory",
] as const;

export const RESOURCE_CATEGORIES = [
  "buildings",
  "land",
  "vehicles",
  "equipment",
  "electronics",
  "computers",
  "phones",
  "tablets",
  "printers",
  "furniture",
  "meeting_rooms",
  "classrooms",
  "storage",
  "campaign_materials",
  "books",
  "training_materials",
  "medical_supplies",
  "emergency_supplies",
  "food",
  "clothing",
  "tools",
  "software_licenses",
  "digital_assets",
  "cloud_services",
  "subscriptions",
  "financial_accounts",
  "inventory",
  "consumables",
] as const;

export const OWNERSHIP_TYPES = [
  "institution_owned",
  "department_owned",
  "partner_owned",
  "loaned",
  "leased",
  "borrowed",
  "donated",
  "grant_funded",
  "volunteer_owned",
] as const;

export const ASSET_LIFECYCLE = [
  "requested",
  "approved",
  "purchased",
  "received",
  "in_service",
  "reserved",
  "assigned",
  "maintenance",
  "repair",
  "retired",
  "disposed",
  "archived",
] as const;

export const RESOURCE_STATUS = [
  "available",
  "reserved",
  "assigned",
  "in_transit",
  "maintenance",
  "out_of_service",
  "lost",
  "retired",
] as const;

export const FUNDING_SOURCES = [
  "general_fund",
  "grant",
  "donation",
  "campaign_funds",
  "membership_fees",
  "program_income",
  "restricted_funds",
  "emergency_funds",
  "custom",
] as const;

export const REQUIRED_RESOURCE_SERVICES = [
  "AssetService",
  "InventoryService",
  "FacilityService",
  "SpaceService",
  "ReservationService",
  "BudgetService",
  "ExpenseService",
  "ProcurementService",
  "VendorService",
  "ContractService",
  "MaintenanceService",
  "FleetService",
  "DigitalAssetService",
  "ResourceHealthService",
  "AIResourceAdvisorService",
] as const;

export const RESOURCE_COMMANDS = [
  "CreateAsset",
  "AssignAsset",
  "ReserveAsset",
  "ReleaseAsset",
  "PurchaseAsset",
  "RecordExpense",
  "ApprovePurchase",
  "ScheduleMaintenance",
  "CompleteMaintenance",
  "AdjustInventory",
  "TransferResource",
  "RetireAsset",
] as const;

export const RESOURCE_AI_MAY_NOT = [
  "Purchase assets autonomously",
  "Dispose of assets without Human approval",
  "Commit institutional expenditures without governance",
  "Override budget restrictions",
  "Transfer resources without audit trail",
] as const;

export function getResourceConstitution() {
  return {
    system_id: "OPS-001",
    build: "11.6",
    wave: "11.6-W5",
    governing_principle: OPS_RESOURCE_PRINCIPLE,
    architecture: [...RESOURCE_ARCHITECTURE],
    resource_categories: [...RESOURCE_CATEGORIES],
    ownership_types: [...OWNERSHIP_TYPES],
    required_services: [...REQUIRED_RESOURCE_SERVICES],
    commands: [...RESOURCE_COMMANDS],
    ai_may_not: [...RESOURCE_AI_MAY_NOT],
    api_namespace: "/api/v1/resources",
  };
}
