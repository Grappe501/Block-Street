/**
 * CAE-11.6-W5 — Resource & stewardship data model
 */
import type {
  ASSET_LIFECYCLE,
  FUNDING_SOURCES,
  OWNERSHIP_TYPES,
  RESOURCE_CATEGORIES,
  RESOURCE_STATUS,
} from "./constitution";

export type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number];
export type OwnershipType = (typeof OWNERSHIP_TYPES)[number];
export type AssetLifecycle = (typeof ASSET_LIFECYCLE)[number];
export type ResourceStatus = (typeof RESOURCE_STATUS)[number];
export type FundingSource = (typeof FUNDING_SOURCES)[number];

export interface AssetRecord {
  resource_id: string;
  institution_id: string;
  resource_type: string;
  category: ResourceCategory;
  sub_category: string;
  name: string;
  description: string;
  status: ResourceStatus;
  lifecycle: AssetLifecycle;
  serial_number: string | null;
  asset_tag: string | null;
  ownership_type: OwnershipType;
  steward_human_id: string;
  custodian_human_id: string | null;
  location_id: string | null;
  condition: "excellent" | "good" | "fair" | "poor" | "critical";
  purchase_date: string | null;
  purchase_price: number | null;
  replacement_value: number | null;
  mission_assignment_id: string | null;
  mission_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface FacilityRecord {
  facility_id: string;
  institution_id: string;
  name: string;
  facility_type: "building" | "campus" | "office" | "meeting_room" | "warehouse" | "storage" | "outdoor" | "training_center";
  address: string;
  region: string | null;
  status: ResourceStatus;
  created_at: string;
}

export interface SpaceRecord {
  space_id: string;
  facility_id: string;
  institution_id: string;
  name: string;
  capacity: number;
  access_rules: string;
  equipment: string[];
  availability: "open" | "restricted" | "closed";
  accessibility: string;
  emergency_information: string;
}

export interface ReservationRecord {
  reservation_id: string;
  resource_id: string;
  institution_id: string;
  human_id: string;
  mission_id: string | null;
  start_time: string;
  end_time: string;
  approval_status: "pending" | "approved" | "denied";
  priority: "low" | "normal" | "high" | "critical";
  status: "scheduled" | "active" | "completed" | "cancelled";
  created_at: string;
}

export interface InventoryItemRecord {
  inventory_id: string;
  institution_id: string;
  category: ResourceCategory;
  name: string;
  quantity: number;
  unit: string;
  storage_location_id: string | null;
  minimum_level: number;
  maximum_level: number;
  reorder_threshold: number;
  expiration: string | null;
  lot_number: string | null;
  mission_id: string | null;
  updated_at: string;
}

export interface BudgetRecord {
  budget_id: string;
  institution_id: string;
  scope_type: "institution" | "department" | "program" | "project" | "mission" | "grant" | "campaign";
  scope_id: string;
  name: string;
  allocated: number;
  committed: number;
  spent: number;
  remaining: number;
  forecast: number;
  owner_human_id: string;
  funding_source: FundingSource;
  created_at: string;
}

export interface ExpenseRecord {
  expense_id: string;
  institution_id: string;
  mission_id: string | null;
  program_id: string | null;
  vendor_id: string | null;
  budget_id: string;
  amount: number;
  description: string;
  receipt_reference: string | null;
  approval_status: "pending" | "approved" | "denied";
  funding_source: FundingSource;
  recorded_by: string;
  recorded_at: string;
}

export interface VendorRecord {
  vendor_id: string;
  institution_id: string;
  organization_name: string;
  contacts: string[];
  services: string[];
  compliance_status: "compliant" | "review_needed" | "non_compliant";
  performance_score: number;
  created_at: string;
}

export interface ContractRecord {
  contract_id: string;
  institution_id: string;
  vendor_id: string;
  title: string;
  renewal_date: string | null;
  obligations: string[];
  insurance_verified: boolean;
  compliance_status: "active" | "expiring" | "expired";
  payment_schedule: string;
}

export interface MaintenanceRecord {
  maintenance_id: string;
  resource_id: string;
  institution_id: string;
  maintenance_type: "inspection" | "service" | "repair" | "warranty";
  scheduled_date: string;
  completed_date: string | null;
  status: "scheduled" | "in_progress" | "completed" | "overdue";
  description: string;
  parts: string[];
  condition_before: string;
  condition_after: string | null;
  recorded_by: string;
}

export interface ProcurementRequestRecord {
  procurement_id: string;
  institution_id: string;
  mission_id: string | null;
  objective_id: string | null;
  item_description: string;
  estimated_cost: number;
  budget_id: string;
  status: "need_identified" | "requested" | "approved" | "purchased" | "received" | "assigned" | "audited";
  requested_by: string;
  approved_by: string | null;
  created_at: string;
}

export interface ResourceHealthRecord {
  health_id: string;
  resource_id: string;
  institution_id: string;
  condition_score: number;
  reliability_score: number;
  utilization_score: number;
  maintenance_risk: number;
  replacement_risk: number;
  mission_criticality: number;
  computed_at: string;
}

export const RESOURCE_STORE_KEYS = {
  assets: "ops_assets",
  facilities: "ops_facilities",
  spaces: "ops_spaces",
  reservations: "ops_reservations",
  inventory: "ops_inventory",
  budgets: "ops_budgets",
  expenses: "ops_expenses",
  vendors: "ops_vendors",
  contracts: "ops_contracts",
  maintenance: "ops_maintenance",
  procurement: "ops_procurement",
  resource_health: "ops_resource_health",
} as const;
