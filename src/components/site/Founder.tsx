import { SectionHeader } from "./Problem";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

export function Founder() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container-page">
        <SectionHeader eyebrow="Founder" title="Built by someone who's spent time in the field" />
        <div className="mx-auto mt-12 max-w-3xl">
          <div className="glass shadow-elevated flex flex-col items-center gap-6 rounded-3xl p-8 text-center sm:flex-row sm:text-left">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-primary-glow to-sunset blur-lg opacity-60" aria-hidden />
              <div className="relative flex size-28 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-glow font-display text-4xl font-bold text-primary-foreground">
                SH
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-display text-2xl font-semibold">Sujaag Hari Team</h3>
              <p className="mt-1 text-sm text-muted-foreground">Founder & Product · Agentic AI, agriculture</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                A small, focused team of engineers and agronomists building an AI that speaks to Pakistan's
                farmers in their language — and pulls its weight in the field.
              </p>
              <div className="mt-4 flex justify-center gap-2 sm:justify-start">
                {[Twitter, Linkedin, Github, Mail].map((Icon, i) => (
                  <a key={i} href="#contact" className="flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground" aria-label="Social link">
                    <Icon className="size-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
