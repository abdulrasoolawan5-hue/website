import { SectionHeader } from "./Problem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, MessageCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(20),
  location: z.string().trim().max(80).optional(),
  crop: z.string().trim().max(80).optional(),
  message: z.string().trim().min(3, "Tell us a bit more").max(1000),
});

export function WhatsAppSection() {
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: form.get("name"),
      phone: form.get("phone"),
      location: form.get("location"),
      crop: form.get("crop"),
      message: form.get("message"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Delivery failed");
      (e.target as HTMLFormElement).reset();
      toast.success("You're on the list — Sujaag Hari will reach out on WhatsApp shortly.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delivery failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="whatsapp" className="border-y border-border/60 bg-secondary/30 py-20 sm:py-28">
      <div className="container-page grid items-center gap-14 lg:grid-cols-2">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[oklch(0.55_0.16_150)]">
            <MessageCircle className="size-3.5" /> WhatsApp
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            An agronomist in every farmer's pocket — over WhatsApp.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            No apps to install. Message Sujaag Hari like a friend — in Urdu, English, or a voice
            note — and get grounded, personalised advice back.
          </p>

          <ul className="mt-6 space-y-3">
            {[
              "Send a photo of a leaf → get a disease diagnosis",
              "Ask for tomorrow's forecast in your voice, in your language",
              "Receive irrigation & mandi price alerts automatically",
              "Escalate to a human agronomist when needed",
            ].map((f) => (
              <li key={f} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                <span className="text-sm text-foreground">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-card p-6 shadow-elevated sm:p-8">
          <div className="mb-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">Get started on WhatsApp</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your details — we'll message you back within minutes.
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="wa-name">Name</Label>
                <Input id="wa-name" name="name" placeholder="Your name" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="wa-phone">WhatsApp number</Label>
                <Input id="wa-phone" name="phone" type="tel" placeholder="+92 3xx xxxxxxx" required />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="wa-loc">Location</Label>
                <Input id="wa-loc" name="location" placeholder="Village, town or city" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="wa-crop">Crop</Label>
                <Input id="wa-crop" name="crop" placeholder="e.g. Wheat, Cotton" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="wa-msg">Your question</Label>
              <Textarea id="wa-msg" name="message" rows={3} placeholder="What's on your mind today?" required />
            </div>
            <Button type="submit" size="lg" disabled={loading} className="rounded-full shadow-glow">
              {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <MessageCircle className="mr-2 size-4" />}
              {loading ? "Sending…" : "Start on WhatsApp"}
            </Button>
            <p className="text-[11px] text-muted-foreground">
              By continuing you agree to receive WhatsApp messages from Sujaag Hari. Reply STOP any time.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
