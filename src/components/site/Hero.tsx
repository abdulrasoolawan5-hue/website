import { Button } from "@/components/ui/button";
import { useSiteLanguage } from "@/contexts/site-language";
import { ArrowRight, MessageCircle, CloudSun, Sprout } from "lucide-react";
import farmerHero from "@/assets/farmer-hero.jpg";

export function Hero() {
  const { t } = useSiteLanguage();
  const { hero } = t;

  return (
    <section id="top" className="relative overflow-hidden gradient-hero">
      <div className="absolute inset-0 grid-pattern opacity-70" aria-hidden />
      <div className="container-page relative grid gap-12 pb-20 pt-16 md:pb-28 md:pt-24 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft backdrop-blur">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            {hero.badge}
          </div>

          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-navy dark:text-foreground sm:text-5xl lg:text-6xl">
            {hero.titleBefore}
            <span className="gradient-text">{hero.titleHighlight}</span>
            {hero.titleAfter}
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {hero.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="rounded-full shadow-glow">
              <a href="#assistant">
                {hero.ctaPrimary}{" "}
                <ArrowRight className="ms-1 size-4 rtl:rotate-180" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <a href="#whatsapp">
                <MessageCircle className="me-1 size-4" /> {hero.ctaWhatsApp}
              </a>
            </Button>
          </div>

          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-6">
            {hero.stats.map((s) => (
              <div key={s.v}>
                <dt className="font-display text-2xl font-bold text-foreground">{s.k}</dt>
                <dd className="mt-1 text-xs text-muted-foreground">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-primary/25 via-accent/20 to-sky/20 blur-2xl" aria-hidden />
            <div className="relative h-full w-full overflow-hidden rounded-[2rem] shadow-elevated ring-1 ring-border">
              <img
                src={farmerHero}
                alt={hero.imageAlt}
                className="h-full w-full object-cover"
                loading="eager"
                fetchPriority="high"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent" />
            </div>

            <FloatCard className="-start-4 top-8 sm:-start-8">
              <CloudSun className="size-4 text-sky" />
              <div>
                <div className="text-[11px] text-muted-foreground">{hero.weatherLocation}</div>
                <div className="text-sm font-semibold">{hero.weatherTemp}</div>
              </div>
            </FloatCard>

            <FloatCard className="bottom-8 end-2 sm:-end-6">
              <Sprout className="size-4 text-primary" />
              <div>
                <div className="text-[11px] text-muted-foreground">{hero.cropStage}</div>
                <div className="text-sm font-semibold">{hero.cropAdvice}</div>
              </div>
            </FloatCard>
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass shadow-elevated absolute flex items-center gap-2.5 rounded-xl bg-card/95 px-3 py-2 animate-float ${className}`}>
      {children}
    </div>
  );
}
