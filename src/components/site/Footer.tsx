import { LogoLockup } from "@/components/brand/Logo";
import { Github, Linkedin, Twitter, MessageCircle } from "lucide-react";

const cols = [
  {
    title: "Product",
    links: ["AI Assistant", "WhatsApp", "Ecosystem", "Roadmap"],
  },
  {
    title: "Company",
    links: ["About", "Founder", "Careers", "Press"],
  },
  {
    title: "Resources",
    links: ["Docs", "API", "Partners", "Security"],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container-page py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <LogoLockup />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Agentic AI for a conscious future — smart, respectful assistance for every farmer.
            </p>
            <div className="mt-5 flex gap-2">
              {[Twitter, Linkedin, Github, MessageCircle].map((Icon, i) => (
                <a key={i} href="#" aria-label="Social" className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground">
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <div className="text-xs font-bold uppercase tracking-wider text-foreground">{c.title}</div>
              <ul className="mt-4 space-y-2 text-sm">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <div>© {new Date().getFullYear()} Sujaag Hari · Agentic AI for a conscious future</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#contact" className="hover:text-foreground">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
