export const BRAND = {
  name: "Koenig Room",
};

export const CONTACTS = {
  phoneDisplay: "+7 (906) 230-20-22",
  phoneHref: "tel:+79062302022",
  email: "salon@koenigroom.ru",
  address: "г. Калининград, ул. М. Гвардии 34к2",
};

export type CatalogCategory = {
  title: string;
  description: string;
  imageSrc: string;
  emphasis?: boolean;
};

export const CATALOG_CATEGORIES: CatalogCategory[] = [
  {
    title: "Шторы и ткани в интерьере",
    description: "Премиальные ткани, пошив, установка",
    imageSrc: "/catalog/decor.jpg",
    emphasis: true,
  },
  {
    title: "Жалюзи",
    description: "Точный свет и приватность",
    imageSrc: "/catalog/blinds.jpg",
  },
  {
    title: "Римские шторы",
    description: "Чистая геометрия и мягкий объём",
    imageSrc: "/gray_hero.jpg",
  },
  {
    title: "Декоративные карнизы",
    description: "Акцент на деталях и архитектуре окна",
    imageSrc: "/catalog/rails.jpg",
  },
  {
    title: "Декор, фурнитура, аксессуары",
    description: "Кисти, подхваты, ленты, материалы",
    imageSrc: "/catalog/rugs.jpg",
  },
  {
    title: "Ковры",
    description: "Тактильность, тепло, завершённость",
    imageSrc: "/catalog/bed.jpg",
  },
  {
    title: "Постельное бельё",
    description: "Комфорт и благородные фактуры",
    imageSrc: "/2foto_dark.jpg",
  },
  {
    title: "Интерьерные покрывала и подушки",
    description: "Финальный штрих к интерьеру",
    imageSrc: "/catalog/pillows.jpg",
  },
];

export const NAV_LINKS = [
  { label: "Каталог", href: "#catalog" },
  { label: "Шторы", href: "#curtains" },
  { label: "Отзывы", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
  { label: "Контакты", href: "#contacts" },
] as const;
