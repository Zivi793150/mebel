export const BRAND = {
  name: "Koenig Room",
};

export const CONTACTS = {
  phoneDisplay: "8(9062) 38-90-38",
  phoneHref: "tel:+79062389038",
  telegramHandle: "@koenig_room",
  telegramHref: "https://t.me/koenigroom",
  email: "salon@koenigroom.ru",
  address: "Салон текстиля \"Koenig Room\", г. Калининград, ул. М. Гвардии 34к2",
  vkHref: "https://vk.com/koenigroom",
  rutubeHref: "https://rutube.ru/channel/74116194/",
  twoGisHref: "https://2gis.ru/kaliningrad/firm/70000001089561588/tab/reviews",
  instagramHref: "https://www.instagram.com/koenigroom/",
  maxHref: "https://max.ru/join/feos5xEfrDQWNiXbR6sjVFkmbiSqzrl6Bb-d9t5_tSg",
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
    imageSrc: "/catalog/1.shtory-i-tkani/1.1.avstriyskie/avstriyskie-na-ikonku.webp",
    emphasis: true,
  },
  {
    slug: "blinds",
    title: "Жалюзи",
    description: "Точный свет и приватность",
    imageSrc: "/catalog/2.zhalyuzi/allyuminievye/foto-na-ikonku-1-.webp",
  },
  {
    slug: "roman",
    title: "Римские шторы",
    description: "Чистая геометрия и мягкий объём",
    imageSrc: "/gray_hero.webp",
  },
  {
    slug: "rails",
    title: "Декоративные карнизы",
    description: "Акцент на деталях и архитектуре окна",
    imageSrc: "/catalog/4.karnizy/bagetnye-karnizy/1.webp",
  },
  {
    slug: "decor",
    title: "Декор, фурнитура, аксессуары",
    description: "Кисти, подхваты, ленты, материалы",
    imageSrc: "/catalog/5.-dekor-furnitura/50007.webp",
  },
  {
    slug: "rugs",
    title: "Ковры",
    description: "Тактильность, тепло, завершённость",
    imageSrc: "/hero.webp",
  },
  {
    slug: "bedding",
    title: "Постельное бельё",
    description: "Комфорт и благородные фактуры",
    imageSrc: "/2foto_dark.webp",
  },
  {
    slug: "pillows",
    title: "Интерьерные покрывала и подушки",
    description: "Финальный штрих к интерьеру",
    imageSrc: "/catalog/8.dekorativnye-podushki-pokryvala/00509_089_dop_-maxiimov.webp",
  },
];

export const NAV_LINKS = [
  { label: "Каталог", href: "/#catalog" },
  { label: "Химчистка", href: "/himchistka" },
  { label: "Дизайнерам", href: "/designers" },
  { label: "О нас", href: "/about" },
  { label: "Отзывы", href: "/reviews" },
  { label: "FAQ", href: "/faq" },
  { label: "Контакты", href: "/contacts" },
] as const;
