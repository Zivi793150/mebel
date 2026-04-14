export const ADMIN_COLLECTIONS = [
  "bedding_items",
  "bedspreads_and_pillows",
  "blinds_subcatalogs",
  "blinds_types",
  "carpet_items",
  "catalog_items",
  "categories",
  "cornices",
  "curtain_types",
  "decor_items",
  "lead_contexts",
  "leads",
  "roman_catalogs",
] as const;

export type AdminCollectionName = (typeof ADMIN_COLLECTIONS)[number];

export function isAllowedCollection(name: string): name is AdminCollectionName {
  return (ADMIN_COLLECTIONS as readonly string[]).includes(name);
}
