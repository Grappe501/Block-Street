/**
 * CAE-11.6-W5 — Seed resource defaults
 */
import { nowIso } from "../../../../utils";
import { seedOrganizationIfEmpty } from "../../organization/services/seed";
import { readStoreSlice } from "./repository";
import { RESOURCE_STORE_KEYS } from "../data-model";
import type {
  AssetRecord,
  BudgetRecord,
  FacilityRecord,
  InventoryItemRecord,
  MaintenanceRecord,
  SpaceRecord,
  VendorRecord,
} from "../data-model";
import { saveAsset, saveBudget, saveFacility, saveInventoryItem, saveMaintenance, saveSpace, saveVendor } from "./repository";

const NOW = nowIso();
const INSTITUTION = "inst-block-street";
const MISSION = "opm-volunteer-training-001";

export function seedResourcesIfEmpty() {
  seedOrganizationIfEmpty();
  if (readStoreSlice(RESOURCE_STORE_KEYS.assets).length > 0) return false;

  const facility: FacilityRecord = {
    facility_id: "fac-training-center",
    institution_id: INSTITUTION,
    name: "Block Street Training Center",
    facility_type: "training_center",
    address: "123 Civic Ave, Chicago IL",
    region: "US-IL",
    status: "available",
    created_at: NOW,
  };
  saveFacility(facility);

  const space: SpaceRecord = {
    space_id: "spc-meeting-room-a",
    facility_id: facility.facility_id,
    institution_id: INSTITUTION,
    name: "Meeting Room A",
    capacity: 24,
    access_rules: "institution_members",
    equipment: ["projector", "whiteboard"],
    availability: "open",
    accessibility: "wheelchair_accessible",
    emergency_information: "Exit via main corridor",
  };
  saveSpace(space);

  const van: AssetRecord = {
    resource_id: "res-field-van-001",
    institution_id: INSTITUTION,
    resource_type: "vehicle",
    category: "vehicles",
    sub_category: "cargo_van",
    name: "Field Operations Van",
    description: "Volunteer transport and supply delivery",
    status: "available",
    lifecycle: "in_service",
    serial_number: "VIN-001234",
    asset_tag: "BS-VAN-01",
    ownership_type: "institution_owned",
    steward_human_id: "usr-001",
    custodian_human_id: "usr-001",
    location_id: facility.facility_id,
    condition: "good",
    purchase_date: "2024-06-01",
    purchase_price: 32000,
    replacement_value: 28000,
    mission_assignment_id: null,
    mission_id: MISSION,
    created_at: NOW,
    updated_at: NOW,
  };
  saveAsset(van);

  const laptop: AssetRecord = {
    resource_id: "res-laptop-001",
    institution_id: INSTITUTION,
    resource_type: "computer",
    category: "computers",
    sub_category: "laptop",
    name: "Field Coordinator Laptop",
    description: "Mission coordination and volunteer check-in",
    status: "available",
    lifecycle: "in_service",
    serial_number: "SN-LAP-789",
    asset_tag: "BS-LAP-01",
    ownership_type: "institution_owned",
    steward_human_id: "usr-001",
    custodian_human_id: null,
    location_id: space.space_id,
    condition: "excellent",
    purchase_date: "2025-01-15",
    purchase_price: 1200,
    replacement_value: 1100,
    mission_assignment_id: null,
    mission_id: MISSION,
    created_at: NOW,
    updated_at: NOW,
  };
  saveAsset(laptop);

  const budget: BudgetRecord = {
    budget_id: "bud-mission-training",
    institution_id: INSTITUTION,
    scope_type: "mission",
    scope_id: MISSION,
    name: "Volunteer Training Mission Budget",
    allocated: 15000,
    committed: 3200,
    spent: 1800,
    remaining: 13200,
    forecast: 12000,
    owner_human_id: "usr-001",
    funding_source: "general_fund",
    created_at: NOW,
  };
  saveBudget(budget);

  const flyers: InventoryItemRecord = {
    inventory_id: "inv-flyers-001",
    institution_id: INSTITUTION,
    category: "campaign_materials",
    name: "Volunteer Recruitment Flyers",
    quantity: 500,
    unit: "sheets",
    storage_location_id: facility.facility_id,
    minimum_level: 100,
    maximum_level: 2000,
    reorder_threshold: 150,
    expiration: null,
    lot_number: "LOT-2026-01",
    mission_id: MISSION,
    updated_at: NOW,
  };
  saveInventoryItem(flyers);

  const vendor: VendorRecord = {
    vendor_id: "ven-print-shop",
    institution_id: INSTITUTION,
    organization_name: "Civic Print Co-op",
    contacts: ["orders@civicprint.example"],
    services: ["printing", "signage"],
    compliance_status: "compliant",
    performance_score: 0.92,
    created_at: NOW,
  };
  saveVendor(vendor);

  const maintenance: MaintenanceRecord = {
    maintenance_id: "mnt-van-service-001",
    resource_id: van.resource_id,
    institution_id: INSTITUTION,
    maintenance_type: "service",
    scheduled_date: "2026-08-01",
    completed_date: null,
    status: "scheduled",
    description: "Quarterly oil change and inspection",
    parts: ["oil_filter"],
    condition_before: "good",
    condition_after: null,
    recorded_by: "usr-001",
  };
  saveMaintenance(maintenance);

  return true;
}
