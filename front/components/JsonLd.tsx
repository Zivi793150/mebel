import { CONTACTS } from "@/lib/constants";

export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Koenig Room",
    description: "Премиальные шторы, жалюзи и интерьерный декор в Калининграде",
    url: "https://koenigroom.ru",
    telephone: CONTACTS.phoneDisplay,
    email: CONTACTS.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACTS.address,
      addressLocality: "Калининград",
      addressRegion: "Калининградская область",
      addressCountry: "RU",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "54.7206719",
      longitude: "20.5636115",
    },
    image: "https://koenigroom.ru/hero.webp",
    sameAs: [
      CONTACTS.telegramHref,
      CONTACTS.vkHref,
      CONTACTS.rutubeHref,
      CONTACTS.twoGisHref,
      CONTACTS.instagramHref,
      CONTACTS.maxHref,
    ].filter(Boolean),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "10:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "11:00",
        closes: "17:00",
      },
    ],
    priceRange: "₽₽₽",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebSiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Koenig Room",
    url: "https://koenigroom.ru",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://koenigroom.ru/catalog?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ProductJsonLd({
  name,
  description,
  image,
  url,
  price,
  availability = "InStock",
}: {
  name: string;
  description: string;
  image: string;
  url: string;
  price?: string;
  availability?: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    url,
    brand: {
      "@type": "Brand",
      name: "Koenig Room",
    },
    ...(price && {
      offers: {
        "@type": "Offer",
        priceCurrency: "RUB",
        price,
        availability: `https://schema.org/${availability}`,
        seller: {
          "@type": "LocalBusiness",
          name: "Koenig Room",
        },
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: Array<{ name: string; url?: string }>;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items
      .filter((item) => item.url)
      .map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function FAQJsonLd({
  questions,
}: {
  questions: Array<{ question: string; answer: string }>;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ReviewJsonLd({
  reviews,
  aggregateRating,
}: {
  reviews: Array<{
    author: string;
    datePublished: string;
    reviewBody: string;
    ratingValue?: number;
  }>;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Koenig Room",
    review: reviews.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      datePublished: r.datePublished,
      reviewBody: r.reviewBody,
      ...(r.ratingValue && {
        reviewRating: {
          "@type": "Rating",
          ratingValue: r.ratingValue,
        },
      }),
    })),
    ...(aggregateRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: aggregateRating.ratingValue,
        reviewCount: aggregateRating.reviewCount,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ServiceJsonLd({
  name,
  description,
  url,
  provider,
  areaServed,
  priceRange,
}: {
  name: string;
  description: string;
  url: string;
  provider?: string;
  areaServed?: string;
  priceRange?: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    provider: {
      "@type": "LocalBusiness",
      name: provider || "Koenig Room",
    },
    areaServed: {
      "@type": "City",
      name: areaServed || "Калининград",
    },
    ...(priceRange && { priceRange }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function OfferJsonLd({
  name,
  description,
  price,
  priceCurrency = "RUB",
  availability = "InStock",
  url,
  image,
}: {
  name: string;
  description: string;
  price?: string;
  priceCurrency?: string;
  availability?: string;
  url: string;
  image?: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Offer",
    name,
    description,
    url,
    ...(image && { image }),
    ...(price && {
      price,
      priceCurrency,
      availability: `https://schema.org/${availability}`,
      seller: {
        "@type": "LocalBusiness",
        name: "Koenig Room",
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
