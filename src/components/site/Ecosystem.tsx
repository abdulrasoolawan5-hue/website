import { SectionHeader } from "./Problem";
import {
  CloudSun, Sprout, Layers, Bug, TrendingUp, Landmark, ShieldCheck, Coins, Satellite, Plane, Mic,
} from "lucide-react";

const agents = [
  { icon: CloudSun, name: "Weather Agent", desc: "Hyperlocal forecasts, alerts, growth-stage guidance.", now: true },
  { icon: Sprout, name: "Crop Agent", desc: "Sowing, fertigation and harvest planning per field.", now: true },
  { icon: Layers, name: "Soil Agent", desc: "Fertility maps, NPK advice and soil-test parsing.", now: false },
  { icon: Bug, name: "Disease Agent", desc: "Photo-based diagnosis for pests and pathogens.", now: true },
  { icon: TrendingUp, name: "Market Agent", desc: "Mandi rates, arrival trends, sell-window signals.", now: true },
  { icon: Coins, name: "Finance Agent", desc: "Loans, Kissan Card and cashflow modelling.", now: false },
  { icon: ShieldCheck, name: "Insurance Agent", desc: "Crop insurance eligibility & claim assistance.", now: false },
  { icon: Landmark, name: "Government Agent", desc: "Subsidies, schemes and paperwork navigation.", now: false },
  { icon: Satellite, name: "Satellite Agent", desc: "NDVI, moisture & yield estimates from space.", now: false },
  { icon: Plane, name: "Drone Agent", desc: "Field scouting, spraying missions, damage maps.", now: false },
  { icon: Mic, name: "Voice Agent", desc: "Multilingual speech in/out for low-literacy farmers.", now: true },
];

export function Ecosystem() {
  return (
    <section id="ecosystem" className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-0 grid-pattern opacity-40" aria-hidden />
      <div className="container-page relative">
        <SectionHeader
          eyebrow="AI ecosystem"
          title="A team of specialised agents — not one giant model"
          desc="Each agent owns a domain. The master agent decides which to consult, in what order, for every farmer's question."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map(({ icon: Icon, name, desc, now }) => (
            <div
              key={name}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-elevated"
            >
              <div className="absolute right-4 top-4">
                {now ? (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                    Live
                  </span>
                ) : (
                  <span className="rounded-full bg-accent/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
                    Roadmap
                  </span>
                )}
              </div>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary-glow/20 text-primary transition-transform group-hover:rotate-3">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold">{name}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
