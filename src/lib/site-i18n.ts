export type SiteLanguage = "EN" | "UR";

export const navLinkKeys = [
  { href: "#solution", key: "product" },
  { href: "#assistant", key: "aiAssistant" },
  { href: "#ecosystem", key: "ecosystem" },
  { href: "#roadmap", key: "roadmap" },
  { href: "#faq", key: "faq" },
] as const;

export type NavLinkKey = (typeof navLinkKeys)[number]["key"];

type HeroStat = { readonly k: string; readonly v: string };

export type SiteTranslations = {
  nav: Record<
    | "product"
    | "aiAssistant"
    | "ecosystem"
    | "roadmap"
    | "faq"
    | "signIn"
    | "tryTheAi"
    | "openMenu"
    | "closeMenu"
    | "switchToUrdu"
    | "switchToEnglish"
    | "switchToLight"
    | "switchToDark",
    string
  >;
  hero: {
    badge: string;
    titleBefore: string;
    titleHighlight: string;
    titleAfter: string;
    description: string;
    ctaPrimary: string;
    ctaWhatsApp: string;
    stats: readonly HeroStat[];
    imageAlt: string;
    weatherLocation: string;
    weatherTemp: string;
    cropStage: string;
    cropAdvice: string;
  };
};

const en: SiteTranslations = {
  nav: {
    product: "Product",
    aiAssistant: "AI Assistant",
    ecosystem: "Ecosystem",
    roadmap: "Roadmap",
    faq: "FAQ",
    signIn: "Sign in",
    tryTheAi: "Try the AI",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    switchToUrdu: "Switch language to Urdu",
    switchToEnglish: "Switch language to English",
    switchToLight: "Switch to light mode",
    switchToDark: "Switch to dark mode",
  },
  hero: {
    badge: "Now live · Built for Pakistani farmers",
    titleBefore: "Smart farming advice for ",
    titleHighlight: "every farmer",
    titleAfter: ".",
    description:
      "Sujaag Hari helps you grow more — with clear guidance on weather, sowing, irrigation, disease and market rates. Ask by chat, WhatsApp or voice, in the language you already speak.",
    ctaPrimary: "Ask Sujaag Hari",
    ctaWhatsApp: "Start on WhatsApp",
    stats: [
      { k: "5+", v: "Languages · Urdu, Punjabi, Sindhi…" },
      { k: "24/7", v: "Always available" },
      { k: "Free", v: "To try today" },
    ],
    imageAlt: "A Pakistani farmer standing in his wheat field at golden hour",
    weatherLocation: "Multan · Today",
    weatherTemp: "34° · Light wind",
    cropStage: "Wheat · Tillering",
    cropAdvice: "Irrigate in 2 days",
  },
};

const ur: SiteTranslations = {
  nav: {
    product: "مصنوعات",
    aiAssistant: "AI معاون",
    ecosystem: "نظام",
    roadmap: "روڈ میپ",
    faq: "عمومی سوالات",
    signIn: "سائن ان",
    tryTheAi: "AI آزمائیں",
    openMenu: "مینو کھولیں",
    closeMenu: "مینو بند کریں",
    switchToUrdu: "اردو میں تبدیل کریں",
    switchToEnglish: "انگریزی میں تبدیل کریں",
    switchToLight: "لائٹ موڈ آن کریں",
    switchToDark: "ڈارک موڈ آن کریں",
  },
  hero: {
    badge: "اب لائیو · پاکستانی کسانوں کے لیے",
    titleBefore: "",
    titleHighlight: "ہر کسان",
    titleAfter: " کے لیے سمارٹ کاشتکاری کا مشورہ۔",
    description:
      "سجاغ ہری آپ کو زیادہ پیداوار حاصل کرنے میں مدد کرتا ہے — موسم، بوائی، آبپاشی، بیماری اور منڈی کے نرخوں پر واضح رہنمائی۔ چیٹ، WhatsApp یا آواز سے پوچھیں، اپنی زبان میں۔",
    ctaPrimary: "سجاغ ہری سے پوچھیں",
    ctaWhatsApp: "WhatsApp پر شروع کریں",
    stats: [
      { k: "5+", v: "زبانیں · اردو، پنجابی، سندھی…" },
      { k: "24/7", v: "ہمیشہ دستیاب" },
      { k: "مفت", v: "آج آزمائیں" },
    ],
    imageAlt: "سنہری روشنی میں گندم کے کھیت میں کھڑا پاکستانی کسان",
    weatherLocation: "ملتان · آج",
    weatherTemp: "34° · ہلکی ہوا",
    cropStage: "گندم · پودے پھیل رہے ہیں",
    cropAdvice: "دو دن بعد آبپاشی کریں",
  },
};

export const translations: Record<SiteLanguage, SiteTranslations> = {
  EN: en,
  UR: ur,
};
