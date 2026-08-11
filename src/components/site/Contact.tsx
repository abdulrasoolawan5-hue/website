import { SectionHeader } from "./Problem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Enter a valid email").max(160),
  org: z.string().trim().max(120).optional(),
  message: z.string().trim().min(10, "Tell us a bit more").max(1000),
});

export function Contact() {
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: form.get("name"),
      email: form.get("email"),
      org: form.get("org"),
      message: form.get("message"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setLoading(true);
    // Placeholder for future POST /api/contact
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    (e.target as HTMLFormElement).reset();
    toast.success("Thanks — we'll get back to you within 2 working days.");
  }

  return (
    <section id="contact" className="border-t border-border/60 bg-gradient-to-b from-secondary/30 to-background py-20 sm:py-28">
      <div className="container-page">
        <SectionHeader eyebrow="Contact" title="Talk to the team" desc="Partnership, pilots, media or just curious? Drop us a line." />
        <form onSubmit={onSubmit} className="mx-auto mt-12 grid max-w-2xl gap-4 rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Your name" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="org">Organisation (optional)</Label>
            <Input id="org" name="org" placeholder="Company, NGO, department…" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" rows={5} placeholder="How can we help?" required />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">We reply within 2 working days.</p>
            <Button type="submit" size="lg" disabled={loading} className="rounded-full shadow-glow">
              {loading ? "Sending…" : "Send message"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
