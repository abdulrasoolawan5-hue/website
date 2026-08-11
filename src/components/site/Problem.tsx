import { AlertTriangle, CloudRain, Bug, TrendingDown, BookX, WifiOff } from "lucide-react";

const problems = [
  { icon: CloudRain, title: "Unpredictable weather", desc: "Farmers lose entire seasons to sudden rain, heatwaves and shifting monsoon patterns." },
  { icon: Bug, title: "Late disease detection", desc: "Pest and fungal outbreaks are noticed only after visible damage — when it's too late." },
  { icon: TrendingDown, title: "Volatile market prices", desc: "No reliable, timely signal for when and where to sell at the best mandi rate." },
  { icon: BookX, title: "Fragmented knowledge", desc: "Best practices sit in PDFs, extension offices and WhatsApp forwards — not in one place." },
  { icon: WifiOff, title: "Low digital literacy", desc: "Apps demand English, forms and typing. Most farmers prefer to talk or send a photo." },
  { icon: AlertTriangle, title: "No trusted advisor", desc: "Rural growers rarely reach a real agronomist, banker or insurer when it actually matters." },
];

export function Problem() {
  return (
    <section id="problem" className="py-20 sm:py-28">
      <div className="container-page">
        <SectionHeader
          eyebrow="The problem"
          title="Farming in Pakistan runs on guesswork"
          desc="Small and mid-scale growers are making million-rupee decisions with almost no personalised, real-time guidance."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-elevated"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  desc,
  center = true,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  center?: boolean;
}) {
  return (
    <div className={`${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      <div className={`inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary`}>
        {eyebrow}
      </div>
      <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {desc && <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{desc}</p>}
    </div>
  );
}
