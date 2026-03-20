export type AdminFieldType = "string" | "text" | "number" | "boolean" | "string_array";

export type AdminFieldDef = {
  key: string;
  label: string;
  type: AdminFieldType;
  placeholder?: string;
};

export type AdminCollectionSchema = {
  title: string;
  fields: AdminFieldDef[];
  supportsImages?: boolean;
};

const COMMON_PRODUCT_FIELDS: AdminFieldDef[] = [
  { key: "title", label: "Название", type: "string" },
  { key: "description", label: "Описание", type: "text" },
  { key: "source", label: "Источник", type: "string" },
  { key: "kind", label: "Тип (kind)", type: "string" },
  { key: "url", label: "URL", type: "string" },
];

export const ADMIN_SCHEMAS: Record<string, AdminCollectionSchema> = {
  cornices: {
    title: "Карнизы",
    supportsImages: true,
    fields: [
      ...COMMON_PRODUCT_FIELDS,
      { key: "manufacturer", label: "Производитель", type: "string" },
      { key: "type", label: "Тип", type: "string" },
      { key: "subtype", label: "Подтип", type: "string" },
      { key: "subtypeTitle", label: "Название подтипа", type: "string" },
      { key: "collectionSlug", label: "Коллекция (slug)", type: "string" },
      { key: "collectionTitle", label: "Коллекция (название)", type: "string" },
    ],
  },
  curtain_types: {
    title: "Виды штор",
    supportsImages: true,
    fields: [
      ...COMMON_PRODUCT_FIELDS,
      { key: "group", label: "Группа", type: "string" },
    ],
  },
  blinds_types: {
    title: "Виды жалюзи",
    supportsImages: true,
    fields: [...COMMON_PRODUCT_FIELDS],
  },
  bedding_items: {
    title: "Постельное бельё",
    supportsImages: true,
    fields: [
      ...COMMON_PRODUCT_FIELDS,
      { key: "variant", label: "Вариант", type: "string" },
      { key: "priceText", label: "Цена (текст)", type: "string" },
    ],
  },
  bedspreads_and_illows: {
    title: "Покрывала и подушки",
    supportsImages: true,
    fields: [
      ...COMMON_PRODUCT_FIELDS,
      { key: "variant", label: "Вариант", type: "string" },
      { key: "priceText", label: "Цена (текст)", type: "string" },
    ],
  },
  carpet_items: {
    title: "Ковры",
    supportsImages: true,
    fields: [
      ...COMMON_PRODUCT_FIELDS,
      { key: "priceText", label: "Цена (текст)", type: "string" },
      { key: "style", label: "Стиль", type: "string" },
      { key: "collection", label: "Коллекция", type: "string" },
      { key: "color", label: "Цвет", type: "string" },
    ],
  },
  catalog_items: {
    title: "Каталог (koenigroom.ru)",
    supportsImages: false,
    fields: [
      { key: "source", label: "Источник", type: "string" },
      { key: "slug", label: "Slug", type: "string" },
      { key: "title", label: "Название", type: "string" },
    ],
  },
  categories: {
    title: "Категории",
    supportsImages: true,
    fields: [
      { key: "slug", label: "Slug", type: "string" },
      { key: "title", label: "Название", type: "string" },
      { key: "description", label: "Описание", type: "text" },
      { key: "order", label: "Порядок", type: "number" },
    ],
  },
  blinds_subcatalogs: {
    title: "Подкаталоги жалюзи",
    supportsImages: true,
    fields: [
      ...COMMON_PRODUCT_FIELDS,
      { key: "slug", label: "Slug", type: "string" },
      { key: "category", label: "Категория", type: "string" },
    ],
  },
  leads: {
    title: "Заявки",
    supportsImages: false,
    fields: [
      { key: "name", label: "Имя", type: "string" },
      { key: "phone", label: "Телефон", type: "string" },
      { key: "message", label: "Сообщение", type: "text" },
      { key: "source", label: "Источник", type: "string" },
    ],
  },
  lead_contexts: {
    title: "Контексты заявок",
    supportsImages: false,
    fields: [
      { key: "productType", label: "productType", type: "string" },
      { key: "title", label: "Название", type: "string" },
      { key: "category", label: "Категория", type: "string" },
      { key: "url", label: "URL", type: "string" },
    ],
  },
};

export function getSchema(collection: string): AdminCollectionSchema | null {
  return ADMIN_SCHEMAS[collection] || null;
}
