export const ADMIN_COLLECTIONS = [
  "bedding_items",
  "bedspreads_and_illows",
  "blinds_subcatalogs",
  "blinds_types",
  "carpet_items",
  "catalog_items",
  "categories",
  "cornices",
  "curtain_types",
  "lead_contexts",
  "leads",
] as const;

export type AdminCollectionName = (typeof ADMIN_COLLECTIONS)[number];

export function isAllowedCollection(name: string): name is AdminCollectionName {
  return (ADMIN_COLLECTIONS as readonly string[]).includes(name);
}
