/**
 * JSON-LD for search engines and agents. Plain objects; the page prints them.
 * The SoftwareApplication itself lives in site.ts and prints from the layout head
 * on every page. These add the Organization, the WebSite, breadcrumbs, an article,
 * an FAQ, or a list on top, all pointing at the same @id values.
 */
import type { Faq } from "./content.ts";
import { HOME_FACTS } from "./content.ts";
import { DOCS } from "./docs.ts";
import { GO7STUDIO_URL, PAGES, absoluteUrl } from "./pages.ts";
import {
  APP_ID,
  DESK_LINE,
  ORG_ID,
  PRODUCT_NAME,
  SITE_ID,
  SITE_ORIGIN,
  SUBSCRIPTION_CLAIM,
} from "./site.ts";

const CONTEXT = "https://schema.org";

export function organizationLd() {
  return {
    "@context": CONTEXT,
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Go7 Studio",
    url: GO7STUDIO_URL,
    logo: absoluteUrl("/logo.png"),
    sameAs: ["https://github.com/go7studio"],
  };
}

export function webSiteLd() {
  return {
    "@context": CONTEXT,
    "@type": "WebSite",
    "@id": SITE_ID,
    name: PRODUCT_NAME,
    url: SITE_ORIGIN,
    description: `${DESK_LINE} ${SUBSCRIPTION_CLAIM}`,
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqLd(items: Faq[]) {
  return {
    "@context": CONTEXT,
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function techArticleLd(input: { path: string; headline: string; description: string }) {
  return {
    "@context": CONTEXT,
    "@type": "TechArticle",
    headline: input.headline,
    description: input.description,
    url: absoluteUrl(input.path),
    inLanguage: "en",
    about: { "@id": APP_ID },
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": SITE_ID },
  };
}

export function webPageLd(input: { path: string; name: string; description: string }) {
  return {
    "@context": CONTEXT,
    "@type": "WebPage",
    url: absoluteUrl(input.path),
    name: input.name,
    description: input.description,
    inLanguage: "en",
    about: { "@id": APP_ID },
    isPartOf: { "@id": SITE_ID },
  };
}

/** The home page's ItemList of what it does, so agents can quote the six facts. */
export function homeFactsLd() {
  return {
    "@context": CONTEXT,
    "@type": "ItemList",
    name: `What ${PRODUCT_NAME} does`,
    itemListElement: HOME_FACTS.map((fact, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: fact.title,
      description: fact.body,
    })),
  };
}

/** The docs index as an ItemList of TechArticles, in reading order. */
export function docsIndexLd() {
  return {
    "@context": CONTEXT,
    "@type": "ItemList",
    name: `${PRODUCT_NAME} docs`,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: DOCS.map((doc, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: doc.title,
      description: doc.lead,
      url: absoluteUrl(`${PAGES.docs.path}/${doc.slug}`),
    })),
  };
}
