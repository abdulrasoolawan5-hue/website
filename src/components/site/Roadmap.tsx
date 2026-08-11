import { SectionHeader } from "./Problem";
import { Check, Circle } from "lucide-react";

const phases = [
  { phase: "Phase 1", title: "Foundation", status: "Shipping", items: ["AI Chat", "WhatsApp bot", "Weather + Crop agent", "Urdu / English"] },
  { phase: "Phase 2", title: "Diagnostics", status: "In build", items: ["Photo disease detection", "Voice-first UX", "Farmer profiles"] },
  { phase: "Phase 3", title: "Markets & Finance", status: "Q2", items: ["Mandi price agent", "Loan & subsidy agent", "Insurance flow"] },
  { phase: "Phase 4", title: "Fields From Space", status: "Q3", items: ["Satellite / NDVI agent", "Drone integrations", "Yield estimates"] },
  { phase: "Phase 5", title: "Marketplace", status: "Later", items: ["Inputs marketplace", "Buyer network", "Farm-to-mandi logistics"] },
];

export function Roadmap() {
  return (
    <section id="roadmap" className="py-20 sm:py-28">
      <div className="container-page">
        <SectionHeader
          eyebrow="Roadmap"
          title="From assistant to full agriculture OS"
          desc="A pragmatic path — one live agent at a time — toward the multi-agent platform every farm deserves."
        />
        <ol className="relative mx-auto mt-14 max-w-3xl border-l border-border pl-6">
          {phases.map((p, i) => (
            <li key={p.phase} className="relative pb-10 last:pb-0">
              <span className="absolute -left-[33px] top-1 flex size-6 items-center justify-center rounded-full border border-border bg-background shadow-soft">
                {i === 0 ? <Check className="size-3 text-primary" /> : <Circle className="size-2.5 text-muted-foreground" />}
              </span>
              <div className="rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-soft">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">{p.phase}</span>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {p.status}
                  </span>
                </div>
                <h3 className="mt-1 font-display text-xl font-semibold">{p.title}</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.items.map((it) => (
                    <span key={it} className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-foreground">
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
