import { SectionHeader } from "./Problem";
import { Users, Building2, Landmark, Banknote, ShieldCheck, Warehouse, GraduationCap } from "lucide-react";

const audiences = [
  { icon: Users, name: "Farmers", desc: "Personalised, in-language advice for every field decision." },
  { icon: Building2, name: "NGOs", desc: "Scale extension services without scaling headcount." },
  { icon: Landmark, name: "Government", desc: "Deliver schemes and advisories where they actually land." },
  { icon: Banknote, name: "Banks", desc: "De-risk agri lending with real-time farm signals." },
  { icon: ShieldCheck, name: "Insurance", desc: "Faster crop insurance underwriting and claims." },
  { icon: Warehouse, name: "Agribusiness", desc: "Reach growers with the right input at the right time." },
  { icon: GraduationCap, name: "Universities", desc: "Deploy research directly into farmer conversations." },
];

export function Solutions() {
  return (
    <section className="border-y border-border/60 bg-secondary/30 py-20 sm:py-28">
      <div className="container-page">
        <SectionHeader
          eyebrow="Built for"
          title="One platform, every part of the agri value chain"
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map(({ icon: Icon, name, desc }) => (
            <div key={name} className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-elevated">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-5 font-display text-base font-semibold">{name}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Benefits() {
  const items = [
    { title: "Better decisions", desc: "Advice tuned to the field, crop and moment — not generic PDFs." },
    { title: "Less waste", desc: "Right input, right amount, right time — from seed to sale." },
    { title: "More reach", desc: "One AI serves thousands of farmers, 24/7, in local languages." },
  ];
  return (
    <section className="py-20 sm:py-28">
      <div className="container-page">
        <SectionHeader eyebrow="Impact" title="Why it matters" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((it, i) => (
            <div key={it.title} className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card to-secondary/40 p-8">
              <div className="font-display text-5xl font-bold text-primary/30">0{i + 1}</div>
              <h3 className="mt-3 font-display text-xl font-semibold">{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
