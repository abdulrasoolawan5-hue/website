import { SectionHeader } from "./Problem";
import { Bot, MessageSquare, CloudSun, Sprout, Mic, Languages, MapPin, ShieldCheck } from "lucide-react";

const features = [
  { icon: Bot, title: "Agentic AI assistant", desc: "A conversational agronomist that reasons across weather, soil, crop and market data." },
  { icon: MessageSquare, title: "WhatsApp native", desc: "Farmers ask questions on the app they already use — no downloads, no logins." },
  { icon: CloudSun, title: "Hyperlocal weather", desc: "Forecasts and alerts tied to the exact village and current growth stage." },
  { icon: Sprout, title: "Crop guidance", desc: "Sowing windows, irrigation schedules and inputs tailored to the field." },
  { icon: Mic, title: "Voice-first", desc: "Ask by voice in Urdu, Punjabi or Sindhi and get spoken answers back." },
  { icon: Languages, title: "Local languages", desc: "Urdu and English today. Punjabi, Sindhi and Pashto on the roadmap." },
  { icon: MapPin, title: "Location aware", desc: "GPS + district-level context so advice matches the farmer's reality." },
  { icon: ShieldCheck, title: "Trusted knowledge", desc: "Grounded in agronomy references, extension guides and vetted datasets." },
];

export function Solution() {
  return (
    <section id="solution" className="border-y border-border/60 bg-gradient-to-b from-secondary/40 to-background py-20 sm:py-28">
      <div className="container-page">
        <SectionHeader
          eyebrow="The solution"
          title="One AI assistant. Every decision on the farm."
          desc="Sujaag Hari brings weather, crops, disease, irrigation and markets into a single conversation — reachable from a phone, in the farmer's language."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-soft"
            >
              <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <Icon className="size-5" />
              </div>
              <h3 className="font-display text-base font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
