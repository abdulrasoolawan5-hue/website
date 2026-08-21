import { SectionHeader } from "./Problem";
import { Logo } from "@/components/brands/logo";
import { Button } from "@/components/ui/button";
import {
  Send,
  Mic,
  MapPin,
  Sprout,
  Languages,
  ImagePlus,
  X,
  Square,
  Loader2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { GoogleGenerativeAI } from "@google/generative-ai";

function buildMockResponse(userText: string, crop: string, location: string): string {
  const q = userText.toLowerCase();
  const loc = location || "your area";
  const c = crop || "your crop";

  if (q.includes("weather") || q.includes("forecast") || q.includes("rain")) {
    return `## 🌤️ Weather Outlook for ${loc}\n\nBased on typical seasonal patterns:\n\n- **Next 3 days:** Partly cloudy, temperatures 28–34°C\n- **Day 4–7:** Light showers possible\n\n**Recommended actions:**\n1. Hold off on irrigation for 2 days\n2. Prepare drainage channels\n\n> ⚠️ *Connect internet for live weather data.*`;
  }
  if (q.includes("irrigat") || q.includes("water") || q.includes("paani")) {
    return `## 💧 Irrigation Advice for ${c}\n\n- Irrigate every **7–10 days** during vegetative stage\n- Irrigate in early morning to reduce evaporation\n\n> ✅ *Adjust based on actual soil moisture.*`;
  }
  if (q.includes("disease") || q.includes("pest") || q.includes("spray") || q.includes("bimari")) {
    return `## 🔍 Pest & Disease Management for ${c}\n\n**Common threats:**\n- Aphids: Spray Imidacloprid 250ml/acre\n- Rust: Spray Propiconazole 250ml/acre\n\n> 📸 *Share a photo for accurate diagnosis.*`;
  }
  return `## 🌿 Farm Advisory — ${c} in ${loc}\n\nAssalam-o-Alaikum! Ask me about weather, crops, irrigation, diseases, or government schemes!\n\n> 🤖 *AI Assistant ready to help.*`;
}

async function* mockStream(text: string): AsyncGenerator<string> {
  const words = text.split(" ");
  for (const word of words) {
    yield word + " ";
    await new Promise<void>((r) => setTimeout(r, 18 + Math.random() * 22));
  }
}

const CROPS = [
  "Wheat", "Cotton", "Rice / Basmati", "Sugarcane", "Maize", "Potato",
  "Onion", "Tomato", "Chilli", "Mango", "Citrus / Kinnow", "Banana",
  "Guava", "Apple", "Sunflower", "Canola / Mustard", "Gram / Chickpea",
  "Lentil / Masoor", "Soybean", "Barley", "Fodder", "Vegetables (mixed)",
];

const LANGUAGES = ["English", "اردو Urdu", "Punjabi", "Sindhi", "Pashto"];

const QUICK = [
  "What's the weather outlook for my field this week?",
  "When should I sow this crop in my area?",
  "How often should I irrigate right now?",
  "What's the current mandi rate near me?",
  "Which government subsidies can I apply for?",
  "Give me today's farm plan.",
];

type Attachment = { dataUrl: string; name: string };
type Part = { type: "text"; text: string } | { type: "image"; image: string };
type UIMessage = { id: string; role: "user" | "assistant"; parts: Part[] };

export function AssistantDemo() {
  const [location, setLocation] = useState("");
  const [crop, setCrop] = useState("Wheat");
  const [language, setLanguage] = useState("English");
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [recSecs, setRecSecs] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  async function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }

  async function handleFiles(files: FileList | File[]) {
    const file = Array.from(files)[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please attach an image."); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error("Image too large (max 10MB)."); return; }
    const dataUrl = await fileToDataUrl(file);
    setAttachment({ dataUrl, name: file.name });
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files?.length) void handleFiles(e.dataTransfer.files);
  }

  function onPaste(e: React.ClipboardEvent) {
    const items = Array.from(e.clipboardData?.files ?? []);
    if (items.length) void handleFiles(items);
  }

  async function submit(text?: string) {
    const content = (text ?? input).trim();
    if (!content && !attachment) return;
    if (isLoading) return;

    const userParts: Part[] = [];
    if (content) userParts.push({ type: "text", text: content });
    if (attachment) userParts.push({ type: "image", image: attachment.dataUrl });

    const userMsg: UIMessage = { id: crypto.randomUUID(), role: "user", parts: userParts };
    const assistantId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      userMsg,
      { id: assistantId, role: "assistant", parts: [{ type: "text", text: "" }] },
    ]);
    setInput("");
    setAttachment(null);
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;

      if (!apiKey) {
        throw new Error("No API key");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: `You are Sujaag Hari, expert AI agriculture assistant for Pakistani farmers.
Farmer crop: ${crop}. Location: ${location || "Pakistan"}. Reply in: ${language}.
Give practical, simple, farmer-friendly advice.
Always recommend consulting a local agronomist for critical decisions.`,
      });

      const result = await model.generateContent(content);
      const reply = result.response.text();

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, parts: [{ type: "text" as const, text: reply }] }
            : m
        )
      );
    } catch (err) {
      console.warn("Gemini failed, using mock:", err);
      const mockText = buildMockResponse(content, crop, location);
      let acc = "";
      for await (const chunk of mockStream(mockText)) {
        if (abortRef.current?.signal.aborted) break;
        acc += chunk;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, parts: [{ type: "text" as const, text: acc }] }
              : m
          )
        );
      }
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }

  async function toggleRecording() {
    if (recording) { recorderRef.current?.stop(); return; }
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error("Voice recording not supported.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        if (timerRef.current) clearInterval(timerRef.current);
        setRecording(false);
        setRecSecs(0);
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        setTranscribing(true);
        try {
          const form = new FormData();
          form.append("file", blob, "recording.webm");
          const res = await fetch("/api/voice", { method: "POST", body: form });
          const data = await res.json() as { text?: string; error?: string };
          if (!res.ok) throw new Error(data.error || "Transcription failed");
          if (data.text) setInput((prev) => prev ? prev + " " + data.text : data.text!);
        } catch (e) {
          toast.error(e instanceof Error ? e.message : "Voice failed");
        } finally {
          setTranscribing(false);
        }
      };
      recorderRef.current = rec;
      rec.start();
      setRecording(true);
      setRecSecs(0);
      timerRef.current = setInterval(() => setRecSecs((s) => s + 1), 1000);
    } catch {
      toast.error("Microphone permission denied.");
    }
  }

  function useMyLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation(`${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)}`),
      () => toast.error("Location permission denied"),
    );
  }

  return (
    <section id="assistant" className="py-20 sm:py-28">
      <div className="container-page">
        <SectionHeader
          eyebrow="Ask Sujaag Hari"
          title="One assistant for your whole farm"
          desc="Ask any farming question by text, voice, or photo. Get grounded advice in your language — 24/7."
        />
        <div className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-4">
            <ControlCard icon={<MapPin className="size-4" />} label="Location">
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Any village, town or city"
                className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground"
              />
              <button type="button" onClick={useMyLocation} className="mt-2 text-[11px] font-medium text-primary hover:underline">
                Use my location
              </button>
            </ControlCard>
            <ControlCard icon={<Sprout className="size-4" />} label="Crop">
              <select value={crop} onChange={(e) => setCrop(e.target.value)} className="w-full bg-transparent text-sm font-medium outline-none">
                {CROPS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </ControlCard>
            <ControlCard icon={<Languages className="size-4" />} label="Language">
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full bg-transparent text-sm font-medium outline-none">
                {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
              </select>
            </ControlCard>
            <div className="rounded-2xl border border-border bg-secondary/50 p-4 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">Try asking</p>
              <ul className="mt-2 space-y-1.5">
                {QUICK.slice(0, 4).map((q) => (
                  <li key={q}>
                    <button type="button" onClick={() => submit(q)} className="text-left hover:text-foreground">· {q}</button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="glass shadow-elevated overflow-hidden rounded-3xl" onDrop={onDrop} onDragOver={(e) => e.preventDefault()} onPaste={onPaste}>
            <div className="flex items-center justify-between border-b border-border/70 bg-card/60 px-4 py-3">
              <div className="flex items-center gap-3">
                <Logo className="size-8" />
                <div>
                  <div className="text-sm font-semibold">Sujaag Hari</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-primary animate-pulse" /> Online · your farming assistant
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-muted-foreground">
                {(location || "Set location")} · {crop} · {language.replace(/^\S+ /, "")}
              </div>
            </div>

            <div ref={scrollRef} className="h-[440px] space-y-3 overflow-y-auto bg-background/60 p-4">
              {messages.length === 0 && (
                <Bubble role="assistant">
                  <p>Assalam-o-Alaikum! I'm Sujaag Hari. Set your location and crop on the left, then ask me anything — by text, voice, or a photo of your plant.</p>
                </Bubble>
              )}
              {messages.map((m) => (
                <Bubble key={m.id} role={m.role}>
                  {m.parts.map((p, i) => {
                    if (p.type === "text") {
                      if (!p.text && m.role === "assistant") {
                        return <span key={i} className="inline-flex gap-1"><Dot /><Dot delay="0.15s" /><Dot delay="0.3s" /></span>;
                      }
                      return (
                        <div key={i} className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1.5 prose-ul:my-1.5">
                          <ReactMarkdown>{p.text}</ReactMarkdown>
                        </div>
                      );
                    }
                    return <img key={i} src={p.image} alt="attached" className="mt-1.5 max-h-48 rounded-lg" />;
                  })}
                </Bubble>
              ))}
            </div>

            <div className="border-t border-border/70 bg-card/60 p-3">
              {attachment && (
                <div className="mb-2 flex items-center gap-2 rounded-xl border border-border bg-background p-2">
                  <img src={attachment.dataUrl} alt="preview" className="size-14 rounded-lg object-cover" />
                  <div className="flex-1 text-xs">
                    <div className="font-medium">{attachment.name}</div>
                    <div className="text-muted-foreground">Ready to send</div>
                  </div>
                  <button type="button" onClick={() => setAttachment(null)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary">
                    <X className="size-4" />
                  </button>
                </div>
              )}
              <form onSubmit={(e) => { e.preventDefault(); void submit(); }} className="flex items-center gap-2 rounded-2xl border border-border bg-background px-2 py-1.5">
                <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
                <button type="button" aria-label="Attach photo" onClick={() => fileRef.current?.click()} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary">
                  <ImagePlus className="size-4" />
                </button>
                <button type="button" aria-label={recording ? "Stop" : "Record"} onClick={toggleRecording} disabled={transcribing}
                  className={`rounded-lg p-2 ${recording ? "bg-destructive text-destructive-foreground animate-pulse" : "text-muted-foreground hover:bg-secondary"}`}>
                  {transcribing ? <Loader2 className="size-4 animate-spin" /> : recording ? <Square className="size-4" /> : <Mic className="size-4" />}
                </button>
                {recording && <span className="text-xs font-medium text-destructive tabular-nums">{Math.floor(recSecs / 60)}:{String(recSecs % 60).padStart(2, "0")}</span>}
                <input value={input} onChange={(e) => setInput(e.target.value)}
                  placeholder={attachment ? "Add a note about the photo…" : "Ask about your farm…"}
                  className="flex-1 bg-transparent px-1 py-1.5 text-sm outline-none placeholder:text-muted-foreground" />
                <Button type="submit" size="sm" disabled={isLoading} className="rounded-xl">
                  <Send className="size-4" />
                </Button>
              </form>
              <p className="mt-1.5 px-1 text-[10px] text-muted-foreground">
                Drop or paste a photo, tap the mic to speak, or type. Always confirm with a local agronomist for critical decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ControlCard({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{icon} {label}</div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Bubble({ role, children }: { role: "assistant" | "user"; children: React.ReactNode }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-up`}>
      <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${isUser ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary text-foreground rounded-bl-sm"}`}>
        {children}
      </div>
    </div>
  );
}

function Dot({ delay = "0s" }: { delay?: string }) {
  return <span style={{ animationDelay: delay }} className="inline-block size-1.5 rounded-full bg-muted-foreground/70 animate-blink" />;
}
