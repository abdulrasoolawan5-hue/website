import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  translations,
  type SiteLanguage,
  type SiteTranslations,
} from "@/lib/site-i18n";

type SiteLanguageContextValue = {
  language: SiteLanguage;
  toggleLanguage: () => void;
  t: SiteTranslations;
};

const SiteLanguageContext = createContext<SiteLanguageContextValue | null>(null);

export function SiteLanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<SiteLanguage>("EN");

  useEffect(() => {
    const root = document.documentElement;
    root.lang = language === "UR" ? "ur" : "en";
    root.dir = language === "UR" ? "rtl" : "ltr";
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      toggleLanguage: () =>
        setLanguage((prev) => (prev === "EN" ? "UR" : "EN")),
      t: translations[language],
    }),
    [language],
  );

  return (
    <SiteLanguageContext.Provider value={value}>
      {children}
    </SiteLanguageContext.Provider>
  );
}

export function useSiteLanguage() {
  const ctx = useContext(SiteLanguageContext);
  if (!ctx) {
    throw new Error("useSiteLanguage must be used within SiteLanguageProvider");
  }
  return ctx;
}
