import { SectionHeader } from "./Problem";
import { User, Globe, Workflow, Brain, CloudSun, Database, MessageSquare } from "lucide-react";

const steps = [
  { icon: User, label: "Farmer", desc: "Asks in text, voice or photo" },
  { icon: Globe, label: "Website / WhatsApp", desc: "Normalizes the request" },
  { icon: Workflow, label: "n8n orchestrator", desc: "Routes to the right agent" },
  { icon: Brain, label: "Master AI agent", desc: "Plans a multi-step answer" },
  { icon: CloudSun, label: "Weather + data APIs", desc: "Pulls hyperlocal signals" },
  { icon: Database, label: "Supabase", desc: "Reads / writes farm memory" },
  { icon: MessageSquare, label: "Response", desc: "Sent back in local language" },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-20 sm:py-28">
      <div className="container-page">
        <SectionHeader
          eyebrow="How it works"
          title="From a farmer's question to a grounded answer"
          desc="Every message flows through an orchestrated pipeline of specialised agents — never a single black-box model."
        />
        <div className="relative mt-14">
          <div className="hidden lg:absolute lg:left-0 lg:right-0 lg:top-1/2 lg:block lg:h-px lg:-translate-y-1/2 lg:bg-gradient-to-r lg:from-transparent lg:via-primary/40 lg:to-transparent" aria-hidden />
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-7">
            {steps.map(({ icon: Icon, label, desc }, i) => (
              <li key={label} className="glass shadow-soft group relative rounded-2xl p-4 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-glow">
                  <Icon className="size-5" />
                </div>
                <div className="mt-3 text-[10px] font-bold uppercase tracking-wider text-primary">Step {i + 1}</div>
                <div className="mt-0.5 text-sm font-semibold">{label}</div>
                <div className="mt-1 text-[11px] leading-snug text-muted-foreground">{desc}</div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
