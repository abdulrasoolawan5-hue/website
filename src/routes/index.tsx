import { createFileRoute } from "@tanstack/react-router";
import { SiteLanguageProvider } from "@/contexts/site-language";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { TrustedBy } from "@/components/site/TrustedBy";
import { Problem } from "@/components/site/Problem";
import { Solution } from "@/components/site/Solution";
import { AssistantDemo } from "@/components/site/assistantDemo";
import { WeatherWidget } from "@/components/site/WeatherWidget";
import { WhatsAppSection } from "@/components/site/WhatsAppSection";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Ecosystem } from "@/components/site/Ecosystem";
import { Architecture } from "@/components/site/architecture";
import { Roadmap } from "@/components/site/Roadmap";
import { Solutions, Benefits } from "@/components/site/Solutions";
import { Founder } from "@/components/site/Founder";
import { FAQ } from "@/components/site/FAQ";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";

const TITLE = "Sujaag Hari — Smart AI Assistance for Every Farmer";
const DESCRIPTION =
  "Agentic AI for Pakistani farmers. Chat, WhatsApp and voice guidance on weather, crops, disease, irrigation and markets — in your language, 24/7.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "keywords", content: "agentic AI, agriculture AI, Pakistan farming, WhatsApp AI, farmer assistant, crop advisory, n8n" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "theme-color", content: "#4e9856" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteLanguageProvider>
    <div className="relative min-h-screen bg-background text-foreground antialiased">
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <Problem />
        <Solution />
        <AssistantDemo />
        <WeatherWidget />
        <WhatsAppSection />
        <HowItWorks />
        <Ecosystem />
        <Architecture />
        <Roadmap />
        <Solutions />
        <Benefits />
        <Founder />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <Toaster position="top-right" richColors />
    </div>
    </SiteLanguageProvider>
  );
}
