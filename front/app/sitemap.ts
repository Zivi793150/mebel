import { MetadataRoute } from "next";

const BASE_URL = "https://koenigroom.ru";

// Категории каталога
const CATEGORIES = [
  { slug: "curtains", title: "Шторы" },
  { slug: "blinds", title: "Жалюзи" },
  { slug: "rails", title: "Карнизы" },
  { slug: "decor", title: "Декор" },
  { slug: "pillows", title: "Подушки" },
  { slug: "bedding", title: "Постельное бельё" },
  { slug: "rugs", title: "Ковры" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // Статические страницы
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/himchistka`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/reviews`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/designers`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/catalog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // Динамические страницы каталога
  const catalogPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${BASE_URL}/catalog/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Подкатегории жалюзи
  const blindsSubcategories = [
    { slug: "aluminum", title: "Алюминиевые жалюзи" },
    { slug: "wooden", title: "Деревянные жалюзи" },
    { slug: "plastic", title: "Пластиковые жалюзи" },
    { slug: "vertical", title: "Вертикальные жалюзи" },
    { slug: "roman", title: "Римские шторы" },
  ];

  const blindsPages: MetadataRoute.Sitemap = blindsSubcategories.map((sub) => ({
    url: `${BASE_URL}/catalog/blinds/${sub.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Карнизы
  const railsPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/catalog/rails/metallic`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  return [...staticPages, ...catalogPages, ...blindsPages, ...railsPages];
}
