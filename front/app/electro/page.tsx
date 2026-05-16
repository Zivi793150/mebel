"use client";

import type { Metadata } from "next";
import Image from "next/image";
import { useState, useCallback } from "react";

import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { ContactButton } from "@/components/ContactButton";

// Компонент карточки с эффектом листания от курсора
type ElectroTypeItem = {
  title: string;
  description: string;
  images: string[];
};

function ElectroTypeCard({ item }: { item: ElectroTypeItem }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = x / width;
    const index = Math.min(
      Math.floor(percentage * item.images.length),
      item.images.length - 1
    );
    setCurrentIndex(index);
  }, [item.images.length]);

  return (
    <article className="group relative overflow-hidden border border-[color:var(--gray-lines)] bg-[color:var(--bg)]">
      <div
        className="relative aspect-[4/3] overflow-hidden cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          setCurrentIndex(0);
        }}
      >
        {item.images.map((src, idx) => (
          <Image
            key={src}
            src={src}
            alt={`${item.title} - фото ${idx + 1}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className={`object-cover transition-opacity duration-300 ${
              idx === currentIndex && isHovering ? "opacity-100" : "opacity-0"
            } ${idx === 0 && !isHovering ? "opacity-100" : ""}`}
            priority={idx === 0}
          />
        ))}
        {/* Индикаторы фото */}
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
          {item.images.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 w-4 rounded-full transition-colors ${
                idx === currentIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-base font-medium text-[color:var(--fg)] leading-tight">
          {item.title}
        </h3>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          {item.description}
        </p>
      </div>
    </article>
  );
}

// Типы


// Данные секций
const HERO = {
  title: "Электрокарнизы",
  subtitle: "Бесшумные, надежные и технологичные электрокарнизы для Умного дома",
  description: "Выезд, замер, расчет и два варианта цены под Ваш бюджет",
  image: "/predlagaem/elektrokarnizy-.webp",
};

const SERVICES = [
  {
    title: "Функция Touch Motion",
    description: "Позволяет перемещать штору вручную без повреждения конструкции",
    imageSrc: "/electro/icon-adv-1.svg",
  },
  {
    title: "Гарантия 5 лет",
    description: "Если оборудование во время гарантийного срока работает некорректно, сделаем замену",
    imageSrc: "/electro/icon-adv-2.svg",
  },
  {
    title: "Бесшумные технологии",
    description: "Бесшумный двигатель до 35 дб и профиль с шумогасителем снижает шум до 15 дб",
    imageSrc: "/electro/icon-adv-3.svg",
  },
  {
    title: "Быстрый монтаж",
    description: "Сделаем под ключ за 1 день",
    imageSrc: "/electro/icon-adv-4.svg",
  },
  {
    title: "Собственное производство",
    description: "Все ткани, механизмы и комплектующие на складе",
    imageSrc: "/electro/icon-adv-5.svg",
  },
  {
    title: "Поддержка Алисы и Siri",
    description: "Управление при помощи приложений Mi Home, Apple Home Kit, Google Home",
    imageSrc: "/electro/icon-adv-6.svg",
  },
];

const TYPES = [
  {
    title: "Раздвижной наклонный электрокарниз",
    description: "Для мансардных и скошенных окон",
    images: [
      "/electro/zpf541bl644etsvmvqu8x5101f1fwjqf.jpg",
      "/electro/ucrweeqf3aydzd4q6e2s7zxrsss1fzop.jpg",
      "/electro/xdl66tsi3wypjza2iupwz8towp9w33qn.jpg",
      "/electro/aqbahmdt4eko7zris8pvjou78an0ap37.jpg",
    ],
  },
  {
    title: "Раздвижной прямой электрокарниз",
    description: "Классическое решение для прямых проемов",
    images: [
      "/electro/cj1yslfwwrw97eoz3mwlr9ooq322yzb3.jpg",
      "/electro/s0tmpjhyke5iqz7czh2tf0cjrbh6r9yk.png",
      "/electro/fgvpdnynzdek6qsmaaf42bfntfu4ehxz.png",
      "/electro/xju8x07rfuqfnkpsbrgjy46n73e3cmgi.jpg",
      "/electro/2sosr8qbdmmaz4rr1fc49wgzngoej89i.jpg",
    ],
  },
  {
    title: "Раздвижной угловой электрокарниз",
    description: "Для эркеров и угловых помещений",
    images: [
      "/electro/d26trwzyg56pm5qsw5dwfqrjsl4ub9f0.jpg",
      "/electro/kemmemocahks0htm2zd7r9sj3ah0w8ow.jpg",
      "/electro/553kay20tleopff6uwgqj1n0yz5chts9.jpg",
      "/electro/55y1oqx0g0bzi9qnk6fm600712z8tccl.jpg",
      "/electro/b28y4hpsde9agyw9j3sgs3okw9piz7wf.jpg",
      "/electro/djprwx8ee6z2xjg89g6y0x6v4imu7pb5.jpg",
      "/electro/wuxcvmjegqnuu0cy0jml31op8ch0n2ep.jpg",
    ],
  },
  {
    title: "Раздвижной радиальный электрокарниз",
    description: "Для изогнутых и радиальных проемов",
    images: [
      "/electro/e4vvaub4qyq8lbeatdergktn89vfbnfb.jpg",
      "/electro/2dvwfkictbegf0gw28f2ymkmmnfa9jm1.jpg",
      "/electro/vj7ao0zos5pvn020sw3fue9bduavc95m.jpg",
      "/electro/yt9xp0a1hc4tuwppub74hhnggke1twiw.jpg",
      "/electro/29z277rl2uzjdsxv2bylig2sp5p843wi.jpg",
      "/electro/58a08px4kjfto3mu11j0j1fmw8br0rmc.jpg",
    ],
  },
  {
    title: "Раздвижной прямой электрокарниз на люверсах",
    description: "Современный дизайн с кольцами-люверсами",
    images: [
      "/electro/1o3bysw2k7990ir6z5kaor4o0316b0ci.jpg",
      "/electro/akpaguwijo8kw982h6l9ozmd474rwo77.png",
      "/electro/ln0xxg0q8nuukcr5ot5j76h6di3wn2zk.png",
      "/electro/esnz5vmw89dg1nnuvt9rh5686ysa6pmp.jpg",
    ],
  },
  {
    title: "Римский электрокарниз с электроприводом",
    description: "Подъемный механизм для римских штор",
    images: [
      "/electro/n1szfwy3h7bjh185fguzcsifxq69m1dp.jpg",
      "/electro/hk1im3r1pp5z9d4owxe5ewnx5y7xcugq.png",
      "/electro/8ogp92xt3w3923dda1jp502f16bop1lu.jpg",
      "/electro/z8zohx4fyzraa2m99c5g6dwvufqvs591.jpg",
      "/electro/4xvyug3efgmppml9cl63c4bcbz3hb2sn.jpg",
    ],
  },
  {
    title: "Римский электрокарниз день-ночь с электроприводом",
    description: "Двойная система управления светом",
    images: [
      "/electro/janr06n307vnsaikabt3tquoq2wm5dwq.jpg",
      "/electro/s6qiesnhw7sgqxzs299ymk5tbn2zhorp.jpg",
      "/electro/umxvm52m4v449b773uhdzrdr7nynm2oi.jpg",
      "/electro/n9q34v879e8qt5hfyrosw6wplnczdug8.jpg",
    ],
  },
  {
    title: "Римский наклонный электрокарниз с электроприводом",
    description: "Для скошенных окон с подъемным механизмом",
    images: [
      "/electro/w8w0qhhjz1asugmb2ck5tu6lzxrbjc6a.jpg",
      "/electro/o2g4hqiennefkbdrb8ts9e8jxjpf9wbl.jpg",
      "/electro/ajh32rxq192sa18c7g4jw4raoa7ncy6d.jpg",
      "/electro/ukln14go30ddf0gd404r1azny53clpr8.jpg",
      "/electro/9r7ezvnhivipz6zzmve2o0jdh48y8dxe.jpg",
    ],
  },
  {
    title: "Рулонный электрокарниз с соединителем и электроприводом",
    description: "Для широких проемов соединенных полотен",
    images: [
      "/electro/ecujr9pjg6z2493790j47qeu0zn515nd.jpg",
      "/electro/raca1sx808y2c42mpp4in3tn1zuat128.jpg",
      "/electro/ncdlt4qbxzaxj9degowam0fq5urhnwbz.jpg",
      "/electro/h9d1fo5ls884lbffbv7gi36da797gi2i.jpg",
      "/electro/vp3u6ymrchcmcpi8mox8f8zijs32uy13.jpg",
    ],
  },
  {
    title: "Рулонный электрокарниз UNI2 с электроприводом",
    description: "Универсальная система для рулонных штор",
    images: [
      "/electro/e5rptf6vmzn0crp5wvph0wd6lwplzc1x.jpg",
      "/electro/jyucjbhfiijdszpx03l31u0iw618i2bo.gif",
      "/electro/otdt6n1cf56qeoy02v1drx08piqhk3th.png",
      "/electro/vp18hej865v54glscrm0i3gjx2280nt2.png",
    ],
  },
  {
    title: "Рулонный электрокарниз открытого типа с электроприводом",
    description: "Классическая открытая система для рулонных штор",
    images: [
      "/electro/qtdx2hb7kh7z831q2fl1zew3uvvtkm9b.jpg",
      "/electro/g9t5lidtio9rpd4z4eu1j64ul3x4b5sw.jpg",
      "/electro/to54gqfhc3c4qu1bwt5ytuqdrzktc0d4.jpg",
      "/electro/t9e0axngi8ma7gs5kgguj9vfa0p0eupi.jpg",
    ],
  },
  {
    title: "Рулонный электрокарниз день-ночь с электроприводом",
    description: "Двойное полотно для регулировки освещения",
    images: [
      "/electro/9ly0rcdxw0lv83pk4ntvrg3rs5fl0a0l.jpg",
      "/electro/9s2d6ktpsgovpom7wy3tpi16kyyjbbzw.jpg",
      "/electro/wvcfslfm1fxq8tgm64zmugif0uxlm3cx.jpg",
      "/electro/610lzxhup72p0bwwuh0doqqigrm1ord7.jpg",
      "/electro/2ln9rhvt412v21s683qgh4mfeylwkki1.jpg",
      "/electro/o9abn0zzk13z35t2b7tobg4u4nzkj16e.jpg",
    ],
  },
  {
    title: "Рулонный электрокарниз зебра в коробе с электроприводом",
    description: "Система зебра в защитном коробе",
    images: [
      "/electro/87dftq9sroixbke0bdo4g23hp8qu8j18.jpg",
      "/electro/zz3he1c1qfqd6jzzstlmhi0svns7cjc9.jpg",
      "/electro/dmsavna6scd65247wetpcym7wpmgbcjn.jpg",
      "/electro/v9q88bylgwu30n7ik9iiq74721iq70as.jpg",
    ],
  },
  {
    title: "Электрокарниз для горизонтальных жалюзи с электроприводом",
    description: "Управление горизонтальными жалюзи",
    images: [
      "/electro/2cxzcnwpb2pbec67lhut5dk0tfr1jpdj.jpg",
      "/electro/6cq4m1cnzogcrr377o67ku1mi5gdg3pv.png",
      "/electro/s8bmeeqjyl3ma0w3b1rrlyfmbdqii2sj.png",
    ],
  },
  {
    title: "Электрокарниз для вертикальных жалюзи с электроприводом",
    description: "Управление вертикальными жалюзи",
    images: [
      "/electro/bpdkjbcq6bw5d2sduk4wsssqrrao7axn.jpg",
      "/electro/fisx11ulrcj2cguhu7fpau8a39v7x953.jpg",
      "/electro/qn7g6pjldaxql8xy84bg21i42h6smy31.jpg",
      "/electro/3bvqcrdbmb6vw0i98bi1hevb7qve3evk.jpg",
      "/electro/ibsvrjiu5yenzvfhnc2vgdet4k9ztuz1.jpg",
      "/electro/bn7vl7f2d240fjhzy3vqqx9k66ankt2v.jpg",
    ],
  },
  {
    title: "Электрокарниз для штор плиссе",
    description: "Специальная система для плиссированных штор",
    images: [
      "/electro/grvtvg899kzl5bcsmeftyl93m7aft8u2.jpg",
      "/electro/vzklk0anhxy2a01qv0vn920fgrsmckvn.jpg",
      "/electro/pmz1nqksdj547gfohbk4z7emem69jqq8.jpg",
      "/electro/r6wk5ijsivijg7zaepyu5z2l1i38x1x6.jpg",
      "/electro/tpojh1ni07beb9fu46m9pt1cg9k9jez8.jpg",
      "/electro/4pbjnd5n2a7qg0kidmgrhsj1quxjbdw6.jpg",
    ],
  },
  {
    title: "Электрокарниз для пергол с электроприводом",
    description: "Для уличных пергол и террас",
    images: [
      "/electro/308a0bfrbag3qjn00dl87rd0n735kqz9.jpg",
      "/electro/m8wyhf8x9q9w5bvt52rk6jtowdudzluf.gif",
      "/electro/213jio6v9rhod7epkws6e9pcl4jnmf44.png",
      "/electro/xdzbd6xdnprf8w2eunrifcfu8bp6kf37.png",
    ],
  },
  {
    title: "Подъёмный механизм лифт-система",
    description: "Для подъема тяжелых портьер",
    images: [
      "/electro/zf56d1c6163bk26r6tmx33e8quu27ez8.jpg",
      "/electro/5u3qginp4yb2j703c3zmziqa7z6vqqr2.png",
      "/electro/yxopxmz17tyh9fk4tzyfa0i6lppts5xl.png",
    ],
  },
];

const STEPS = [
  {
    number: "01",
    description: "Выезд дизайнера на объект для консультации и замеров",
  },
  {
    number: "02",
    description: "Составление коммерческого предложения с двумя вариантами цены",
  },
  {
    number: "03",
    description: "Изготовление электрокарниза на собственном производстве",
  },
  {
    number: "04",
    description: "Монтаж и настройка системы управления за 1 день",
  },
];

const CONTACTS = {
  phone: "8(9062) 38-90-38",
  phoneHref: "tel:+79062389038",
};

export default function ElectroPage() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <Header />

      <main className="pb-16 sm:pb-20">
        {/* Hero Section */}
        <section className="relative">
          <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden sm:h-[70vh]">
            <Image
              src={HERO.image}
              alt={HERO.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center">
              <Container>
                <div className="max-w-2xl text-white">
                  <h1 className="text-3xl font-light tracking-[0.05em] uppercase sm:text-5xl lg:text-6xl">
                    {HERO.title}
                  </h1>
                  <p className="mt-4 text-lg font-light sm:text-xl">
                    {HERO.subtitle}
                  </p>
                  <p className="mt-2 text-sm opacity-90 sm:text-base">
                    {HERO.description}
                  </p>
                  <ContactButton
                    className="mt-8 inline-flex h-12 items-center justify-center bg-[color:var(--green)] px-8 text-xs font-normal uppercase tracking-[0.15em] text-white transition hover:bg-[color:var(--dark-gray)]"
                  >
                    Получить консультацию
                  </ContactButton>
                </div>
              </Container>
            </div>
          </div>
        </section>

        {/* Преимущества - стиль Services компактный */}
        <section className="bg-[color:var(--sand)] py-10 sm:py-14">
          <Container>
            <div className="mb-6">
              <span className="block text-xl font-light tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-2xl lg:text-3xl">
                Преимущества
              </span>
              <span className="block text-xl font-medium tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-2xl lg:text-3xl">
                электрокарнизов
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map((item, idx) => (
                <article
                  key={idx}
                  className="group relative overflow-hidden border border-[color:var(--gray-lines)] bg-[color:var(--bg)]"
                >
                  <div className="relative aspect-[16/9] overflow-hidden flex items-center justify-center bg-[color:var(--bg)] p-4">
                    <Image
                      src={item.imageSrc}
                      alt={item.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-contain p-4 transition duration-500 group-hover:scale-105 [filter:brightness(0)_sepia(100%)_saturate(300%)_hue-rotate(350deg)_brightness(0.7)]"
                    />
                  </div>
                  <div className="border-t border-[color:var(--gray-lines)] p-4">
                    <h3 className="text-sm font-medium text-[color:var(--fg)]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-[color:var(--muted)]">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>

        {/* Типы электрокарнизов */}
        <section className="bg-[color:var(--bg)] py-16 sm:py-20">
          <Container>
            <div className="mb-8">
              <span className="block text-2xl font-light tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
                Виды
              </span>
              <span className="block text-2xl font-medium tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
                электрокарнизов
              </span>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {TYPES.map((item, idx) => (
                <ElectroTypeCard key={idx} item={item} />
              ))}
            </div>
          </Container>
        </section>

        {/* Виды управления карнизами */}
        <section className="bg-[color:var(--sand)] py-16 sm:py-20">
          <Container>
            <div className="mb-8">
              <span className="block text-2xl font-light tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
                Виды управления
              </span>
              <span className="block text-2xl font-medium tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
                карнизами
              </span>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              <div className="group">
                <div className="border border-[color:var(--gray-lines)] bg-[color:var(--bg)] overflow-hidden">
                  <Image
                    src="/electro/image16.png"
                    alt="Пульт ДУ"
                    width={400}
                    height={300}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <h3 className="mt-4 text-base font-medium text-[color:var(--fg)] leading-snug">
                  Механизмом можно управлять дистанционно от программируемого пульта ДУ
                </h3>
              </div>
              <div className="group">
                <div className="border border-[color:var(--gray-lines)] bg-[color:var(--bg)] overflow-hidden">
                  <Image
                    src="/electro/image16-1.png"
                    alt="Приложения"
                    width={400}
                    height={300}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <h3 className="mt-4 text-base font-medium text-[color:var(--fg)] leading-snug">
                  Управление осуществляется с помощью приложений IHC или Mi Home
                </h3>
              </div>
              <div className="group">
                <div className="border border-[color:var(--gray-lines)] bg-[color:var(--bg)] overflow-hidden">
                  <Image
                    src="/electro/image16-2.png"
                    alt="Умные колонки"
                    width={400}
                    height={300}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <h3 className="mt-4 text-base font-medium text-[color:var(--fg)] leading-snug">
                  Управление с помощью современных умных колонок или систему умного дома
                </h3>
              </div>
            </div>
          </Container>
        </section>

        {/* Порядок работы - стиль WorkSteps */}
        <section className="bg-[color:var(--bg)] py-16 sm:py-20">
          <Container>
            <div className="mb-8">
              <span className="block text-2xl font-light tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
                Порядок
              </span>
              <span className="block text-2xl font-medium tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
                работы
              </span>
            </div>
            <p className="text-sm text-[color:var(--muted)] sm:text-base">
              Как мы работаем с электрокарнизами
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step) => (
                <div key={step.number} className="border-b border-[color:var(--gray-lines)] bg-[color:var(--bg)] p-6">
                  <div className="text-xl font-medium text-[color:var(--fg)]">
                    {step.number}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="bg-[color:var(--bg)] py-14 sm:py-18">
          <Container>
            <div className="mb-8">
              <span className="block text-2xl font-light tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
                Видео
              </span>
              <span className="block text-2xl font-medium tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-4xl lg:text-5xl">
                в интерьере
              </span>
            </div>

            <div className="mx-auto w-full max-w-[320px] overflow-hidden border border-[color:var(--gray-lines)] bg-[color:var(--card)] sm:max-w-[380px]">
              <div className="relative aspect-[9/16]">
                <video
                  className="h-full w-full object-contain bg-black"
                  src="/IMG_5722.MOV"
                  controls
                  playsInline
                  preload="metadata"
                />
              </div>
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="bg-[color:var(--bg)] py-16 sm:py-20">
          <Container>
            <div className="flex flex-col items-center text-center">
              <h2 className="text-2xl font-light tracking-[0.05em] uppercase text-[color:var(--fg)] sm:text-3xl lg:text-4xl">
                Готовы автоматизировать шторы?
              </h2>
              <p className="mt-4 max-w-xl text-sm text-[color:var(--muted)] sm:text-base">
                Оставьте заявку и наш дизайнер свяжется с вами для бесплатной консультации и замера
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <ContactButton
                  className="inline-flex h-12 items-center justify-center bg-[color:var(--green)] px-8 text-xs font-normal uppercase tracking-[0.15em] text-white transition hover:bg-[color:var(--dark-gray)]"
                >
                  Получить консультацию
                </ContactButton>
                <a
                  href={CONTACTS.phoneHref}
                  className="inline-flex h-12 items-center justify-center border border-[color:var(--gray-lines)] bg-[color:var(--bg)] px-5 text-sm font-medium text-[color:var(--fg)] transition hover:bg-[color:var(--gray-lines)]"
                >
                  Позвонить: {CONTACTS.phone}
                </a>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
      <MobileCtaBar />
    </div>
  );
}
