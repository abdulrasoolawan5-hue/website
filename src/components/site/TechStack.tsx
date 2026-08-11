import { SectionHeader } from "./Problem";

const stack = [
  "n8n", "OpenAI", "Gemini", "Supabase", "PostgreSQL", "Docker", "Vercel", "WhatsApp Cloud API",
  "Next.js", "TypeScript", "Tailwind", "Node.js",
];

export function TechStack() {
  return (
    <section className="border-y border-border/60 bg-secondary/30 py-20 sm:py-28">
      <div className="container-page">
        <SectionHeader eyebrow="Under the hood" title="A modern, boring-in-the-good-way stack" desc="Chosen for speed of iteration and easy handover to enterprise partners." />
        <div className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3">
          {stack.map((s) => (
            <div key={s} className="glass shadow-soft flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:shadow-elevated">
              <span className="size-2 rounded-full bg-gradient-to-br from-primary to-primary-glow" />
              {s}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}