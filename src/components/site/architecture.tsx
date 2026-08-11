import { SectionHeader } from "./Problem";
import { MessageSquare, Smartphone, Mic, Brain, Sprout, Bell } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    label: "You ask",
    desc: "Text, voice note, or a photo of your plant — in your language.",
  },
  {
    icon: Smartphone,
    label: "Anywhere",
    desc: "Over WhatsApp, the web app, or a simple voice call.",
  },
  {
    icon: Brain,
    label: "We understand",
    desc: "Sujaag Hari reads the question, checks your location, crop, and season.",
  },
  {
    icon: Sprout,
    label: "We advise",
    desc: "Grounded guidance on weather, irrigation, disease, market, and government support.",
  },
  {
    icon: Bell,
    label: "We follow up",
    desc: "Timely alerts before rain, spraying windows, and price movements.",
  },
  {
    icon: Mic,
    label: "Always in your language",
    desc: "Urdu, Punjabi, Sindhi, Pashto, English — spoken or written.",
  },
];

export function Architecture() {
  return (
    <section className="border-y border-border/60 bg-gradient-to-b from-background to-secondary/40 py-20 sm:py-28">
      <div className="container-page">
        <SectionHeader
          eyebrow="How it works for you"
          title="A single friendly assistant behind the scenes"
          desc="You don't need to learn anything technical. Ask a question the way you would ask a neighbour — Sujaag Hari does the rest."
        />
        <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map(({ icon: Icon, label, desc }, i) => (
            <div
              key={label}
              className="glass shadow-soft group rounded-2xl border border-border p-5 transition-all hover:shadow-elevated"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <div className="font-display text-base font-semibold">
                  {String(i + 1).padStart(2, "0")} · {label}
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
