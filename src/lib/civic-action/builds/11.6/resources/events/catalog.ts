/**
 * CAE-11.6-W5 — Resource events
 */
export const RESOURCE_EVENT_CATALOG = [
  { event: "asset.created", domain: "asset", description: "Institutional asset created" },
  { event: "asset.assigned", domain: "asset", description: "Asset assigned to mission or steward" },
  { event: "asset.reserved", domain: "reservation", description: "Asset reserved for time period" },
  { event: "asset.released", domain: "reservation", description: "Asset reservation released" },
  { event: "maintenance.scheduled", domain: "maintenance", description: "Maintenance scheduled for asset" },
  { event: "maintenance.completed", domain: "maintenance", description: "Maintenance completed" },
  { event: "inventory.adjusted", domain: "inventory", description: "Inventory quantity adjusted" },
  { event: "budget.updated", domain: "budget", description: "Budget allocation updated" },
  { event: "expense.recorded", domain: "expense", description: "Expense recorded with mission context" },
  { event: "vendor.created", domain: "vendor", description: "Vendor registered" },
  { event: "contract.expiring", domain: "contract", description: "Contract approaching renewal" },
  { event: "resource.retired", domain: "lifecycle", description: "Resource retired from service" },
] as const;
