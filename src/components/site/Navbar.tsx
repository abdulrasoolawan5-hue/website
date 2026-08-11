import { LogoLockup } from "@/components/brands/logo";
import { Button } from "@/components/ui/button";
import { useSiteLanguage } from "@/contexts/site-language";
import { navLinkKeys } from "@/lib/site-i18n";
import { Menu, X, Languages, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const { language, toggleLanguage, t } = useSiteLanguage();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const languageLabel =
    language === "EN" ? t.nav.switchToUrdu : t.nav.switchToEnglish;

  const darkModeLabel = dark ? t.nav.switchToLight : t.nav.switchToDark;

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="container-page pt-4">
        <div className="glass shadow-soft flex items-center justify-between rounded-2xl px-3 py-2.5 sm:px-4">
          <a href="#top" className="shrink-0">
            <LogoLockup />
          </a>
          <nav className="hidden items-center gap-1 md:flex">
            {navLinkKeys.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {t.nav[l.key]}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 shrink-0"
              aria-label={darkModeLabel}
              onClick={() => setDark((v) => !v)}
            >
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1.5"
              aria-label={languageLabel}
              onClick={toggleLanguage}
            >
              <Languages className="size-4 shrink-0" />
              <span
                className={
                  language === "EN"
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground"
                }
              >
                EN
              </span>
              <span className="text-muted-foreground">/</span>
              <span
                className={
                  language === "UR"
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground"
                }
              >
                اردو
              </span>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <a href="#contact">{t.nav.signIn}</a>
            </Button>
            <Button asChild size="sm" className="rounded-full shadow-glow">
              <a href="#assistant">{t.nav.tryTheAi}</a>
            </Button>
          </div>
          <button
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            className="rounded-lg p-2 md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {open && (
          <div className="glass shadow-soft mt-2 rounded-2xl p-3 md:hidden animate-fade-up">
            <div className="flex flex-col gap-1">
              {navLinkKeys.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  {t.nav[l.key]}
                </a>
              ))}
              <div className="mt-2 flex items-center gap-2 border-t border-border pt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-9 shrink-0"
                  aria-label={darkModeLabel}
                  onClick={() => setDark((v) => !v)}
                >
                  {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5"
                  aria-label={languageLabel}
                  onClick={toggleLanguage}
                >
                  <Languages className="size-4 shrink-0" />
                  <span
                    className={
                      language === "EN"
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground"
                    }
                  >
                    EN
                  </span>
                  <span className="text-muted-foreground">/</span>
                  <span
                    className={
                      language === "UR"
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground"
                    }
                  >
                    اردو
                  </span>
                </Button>
              </div>
              <Button asChild size="sm" className="mt-2 rounded-full">
                <a href="#assistant">{t.nav.tryTheAi}</a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
