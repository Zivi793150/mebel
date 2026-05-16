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
  { key: "url", label: "Ссылка", type: "string" },
];

export const ADMIN_SCHEMAS: Record<string, AdminCollectionSchema> = {
  cornices: {
    title: "Карнизы",
    supportsImages: true,
    fields: [
      { key: "title", label: "Название", type: "string" },
      { key: "type", label: "Категория", type: "string", placeholder: "Напр: Потолочные, Багетные, Металлические, Профильные, Латунные, Электро" },
      { key: "collectionTitle", label: "Название коллекции", type: "string" },
      { key: "priceText", label: "Цена (текст)", type: "string" },
      { key: "description", label: "Описание", type: "text" },
      { key: "manufacturer", label: "Производитель", type: "string" },
      { key: "subtype", label: "Подтип (для фильтра)", type: "string" },
      { key: "subtypeTitle", label: "Название подтипа", type: "string" },
      { key: "collectionSlug", label: "Коллекция (slug)", type: "string" },
      { key: "source", label: "Источник", type: "string" },
      { key: "kind", label: "Тип (kind)", type: "string" },
      { key: "url", label: "Ссылка", type: "string" },
    ],
  },
  curtain_types: {
    title: "Виды штор",
    supportsImages: true,
    fields: [
      { key: "title", label: "Название", type: "string" },
      { key: "group", label: "Группа (напр: ПОМЕЩЕНИЕ)", type: "string" },
      { key: "description", label: "Описание", type: "text" },
      { key: "source", label: "Источник", type: "string" },
      { key: "kind", label: "Тип (kind)", type: "string" },
      { key: "url", label: "Ссылка", type: "string" },
    ],
  },
  blinds_types: {
    title: "Виды жалюзи",
    supportsImages: true,
    fields: [
      { key: "title", label: "Название", type: "string" },
      { key: "description", label: "Описание", type: "text" },
      { key: "source", label: "Источник", type: "string" },
      { key: "kind", label: "Тип (kind)", type: "string" },
      { key: "url", label: "Ссылка", type: "string" },
    ],
  },
  bedding_items: {
    title: "Постельное бельё",
    supportsImages: true,
    fields: [
      { key: "title", label: "Название", type: "string" },
      { key: "variant", label: "Вариант (напр: Вариант 1)", type: "string" },
      { key: "priceText", label: "Цена (текст)", type: "string" },
      { key: "description", label: "Описание", type: "text" },
      { key: "source", label: "Источник", type: "string" },
      { key: "kind", label: "Тип (kind)", type: "string" },
      { key: "url", label: "Ссылка", type: "string" },
    ],
  },
  bedspreads_and_pillows: {
    title: "Покрывала и подушки",
    supportsImages: true,
    fields: [
      { key: "title", label: "Название", type: "string" },
      { key: "variant", label: "Вариант", type: "string" },
      { key: "priceText", label: "Цена (текст)", type: "string" },
      { key: "description", label: "Описание", type: "text" },
      { key: "source", label: "Источник", type: "string" },
      { key: "kind", label: "Тип (kind)", type: "string" },
      { key: "url", label: "Ссылка", type: "string" },
    ],
  },
  carpet_items: {
    title: "Ковры",
    supportsImages: true,
    fields: [
      { key: "title", label: "Название", type: "string" },
      { key: "priceText", label: "Цена (текст)", type: "string" },
      { key: "style", label: "Стиль", type: "string" },
      { key: "collection", label: "Коллекция", type: "string" },
      { key: "color", label: "Цвет", type: "string" },
      { key: "description", label: "Описание", type: "text" },
      { key: "source", label: "Источник", type: "string" },
      { key: "kind", label: "Тип (kind)", type: "string" },
      { key: "url", label: "Ссылка", type: "string" },
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
  decor_items: {
    title: "Декор и фурнитура",
    supportsImages: true,
    fields: [
      { key: "category", label: "Вид фурнитуры", type: "string", placeholder: "Напр: Кисти и подхваты, Бахрома, Тесьма" },
      { key: "title", label: "Название", type: "string", placeholder: "Напр: Вариант 1" },
      { key: "description", label: "Описание", type: "text" },
      { key: "source", label: "Источник", type: "string" },
    ],
  },
  leads: {
    title: "Заявки",
    supportsImages: false,
    fields: [
      { key: "name", label: "Имя клиента", type: "string" },
      { key: "phone", label: "Телефон", type: "string" },
      { key: "message", label: "Сообщение", type: "text" },
      { key: "source", label: "Страница, с которой пришла заявка", type: "string" },
    ],
  },
  lead_contexts: {
    title: "Где была кнопка (Контекст)",
    supportsImages: false,
    fields: [
      { key: "productType", label: "Тип товара", type: "string" },
      { key: "title", label: "Название на кнопке", type: "string" },
      { key: "category", label: "Категория", type: "string" },
      { key: "url", label: "Ссылка", type: "string" },
    ],
  },
};

export function getSchema(collection: string): AdminCollectionSchema | null {
  return ADMIN_SCHEMAS[collection] || null;
}
