export const BRAND = {
  name: "Koenig Room",
};

export const CONTACTS = {
  phoneDisplay: "+7 (906) 230-20-22",
  phoneHref: "tel:+79062302022",
  telegramHandle: "@koenig_room",
  telegramHref: "https://t.me/koenig_room",
  email: "salon@koenigroom.ru",
  address: "г. Калининград, ул. М. Гвардии 34к2",
  vkHref: "https://vk.com/koenigroom",
  rutubeHref: "https://rutube.ru/channel/74116194/",
  twoGisHref:
    "https://2gis.ru/kaliningrad/search/%D0%9A%D0%BE%D0%B2%D1%80%D1%8B/rubricId/19505/firm/70000001103690198/20.563928%2C54.720942?m=20.545521%2C54.723172%2F16.14",
  instagramHref: "https://www.instagram.com/koenigroom/",
};

export type CatalogCategory = {
  slug: string;
  title: string;
  description: string;
  imageSrc: string;
  emphasis?: boolean;
};

export const CATALOG_CATEGORIES: CatalogCategory[] = [
  {
    slug: "curtains",
    title: "Шторы и ткани в интерьере",
    description: "Премиальные ткани, пошив, установка",
    imageSrc: "/catalog/decor.jpg",
    emphasis: true,
  },
  {
    slug: "blinds",
    title: "Жалюзи",
    description: "Точный свет и приватность",
    imageSrc: "/catalog/blinds.jpg",
  },
  {
    slug: "roman",
    title: "Римские шторы",
    description: "Чистая геометрия и мягкий объём",
    imageSrc: "/gray_hero.jpg",
  },
  {
    slug: "rails",
    title: "Декоративные карнизы",
    description: "Акцент на деталях и архитектуре окна",
    imageSrc: "/catalog/rails.jpg",
  },
  {
    slug: "decor",
    title: "Декор, фурнитура, аксессуары",
    description: "Кисти, подхваты, ленты, материалы",
    imageSrc: "/catalog/rugs.jpg",
  },
  {
    slug: "rugs",
    title: "Ковры",
    description: "Тактильность, тепло, завершённость",
    imageSrc: "/catalog/bed.jpg",
  },
  {
    slug: "bedding",
    title: "Постельное бельё",
    description: "Комфорт и благородные фактуры",
    imageSrc: "/2foto_dark.jpg",
  },
  {
    slug: "pillows",
    title: "Интерьерные покрывала и подушки",
    description: "Финальный штрих к интерьеру",
    imageSrc: "/catalog/pillows.jpg",
  },
];

export const NAV_LINKS = [
  { label: "Каталог", href: "/#catalog" },
  { label: "Дизайнерам", href: "/designers" },
  { label: "О нас", href: "/about" },
  { label: "Отзывы", href: "/reviews" },
  { label: "FAQ", href: "/faq" },
  { label: "Контакты", href: "/contacts" },
] as const;
