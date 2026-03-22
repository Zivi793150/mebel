import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/Container";

type BlogItem = {
  title: string;
  imageSrc: string;
  href: string;
};

const BLOG_ITEMS: BlogItem[] = [
  {
    title: "Как выбрать идеальные шторы для премиального интерьера",
    imageSrc: "/hero.jpg",
    href: "/article/1",
  },
  {
    title: "Влияние штор на атмосферу в помещении и их роль в создании комфортного пространства",
    imageSrc: "/hero2.jpg",
    href: "/article/2",
  },
  {
    title: "Советы по уходу за дорогими тканями и дизайнерскими шторами",
    imageSrc: "/gray_hero.jpg",
    href: "/article/3",
  },
  {
    title: "Как правильно подобрать шторы в комнату",
    imageSrc: "/hero.jpg",
    href: "/article/4",
  },
  {
    title: "Шторы для маленькой спальни",
    imageSrc: "/hero2.jpg",
    href: "/article/5",
  },
  {
    title: "Пошив штор на заказ в Калининграде",
    imageSrc: "/gray_hero.jpg",
    href: "/article/6",
  },
];

export function BlogSection() {
  return (
    <section className="bg-white py-14 sm:py-18">
      <Container>
        <div className="text-xs font-semibold tracking-[0.32em] text-[color:var(--muted)]">
          БЛОГ
        </div>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--fg)] sm:text-5xl">
          Полезные статьи
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)] sm:text-base">
          Советы по выбору, уходу и дизайну текстиля
        </p>
      </Container>

      <div className="mt-8 overflow-x-auto">
        <div className="flex gap-4 px-4 sm:px-6 lg:px-8">
          {BLOG_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative w-[260px] flex-shrink-0 overflow-hidden rounded-2xl bg-[#f5f5f5] sm:w-[300px]"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  fill
                  sizes="300px"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium leading-5 text-black line-clamp-2">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Container>
        <div className="mt-8">
          <Link
            href="/blog"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-black/20 bg-white px-5 text-sm font-semibold text-black shadow-sm transition hover:bg-black/5"
          >
            Все статьи
          </Link>
        </div>
      </Container>
    </section>
  );
}
