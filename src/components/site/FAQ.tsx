import { SectionHeader } from "./Problem";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Is Sujaag Hari free for farmers?", a: "Core assistant access on WhatsApp and web will remain free for individual farmers. Institutional partners (banks, NGOs, government, agribusiness) fund the platform through paid deployments." },
  { q: "Which languages are supported?", a: "Today: English and Urdu (text + voice in preview). Punjabi, Sindhi and Pashto are on the near-term roadmap." },
  { q: "Where does the advice come from?", a: "Answers are grounded in vetted agronomy references, extension guides and hyperlocal data (weather, mandi rates, soil). The master AI agent cites its sources when it can." },
  { q: "How is my farm data used?", a: "Farm data is used to personalise your advice. It is stored securely in Supabase, never sold, and can be deleted on request." },
  { q: "Can I integrate Sujaag Hari with my organisation?", a: "Yes. We offer partner APIs and n8n workflow templates for NGOs, banks, insurers and government departments. Get in touch below." },
  { q: "Do you support voice notes on WhatsApp?", a: "Yes — farmers can send voice notes and the assistant replies in voice, in their preferred language." },
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="container-page">
        <SectionHeader eyebrow="FAQ" title="Answers, before you ask" />
        <div className="mx-auto mt-10 max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`i-${i}`} className="glass shadow-soft rounded-2xl border-none px-5">
                <AccordionTrigger className="text-left font-display text-base font-semibold hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
