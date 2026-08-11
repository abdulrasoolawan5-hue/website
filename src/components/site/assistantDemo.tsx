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

// ---------------------------------------------------------------------------
// Client-side mock stream — used when /api/chat is unavailable on localhost
// ---------------------------------------------------------------------------
function buildMockResponse(userText: string, crop: string, location: string): string {
  const q = userText.toLowerCase();
  const loc = location || "your area";
  const c = crop || "your crop";

  if (q.includes("weather") || q.includes("forecast") || q.includes("rain")) {
    return `## 🌤️ Weather Outlook for ${loc}\n\nBased on typical seasonal patterns for **${loc}**:\n\n- **Next 3 days:** Partly cloudy, temperatures 28–34°C, low chance of rain\n- **Day 4–7:** Light showers possible — ideal for ${c} if you haven't irrigated recently\n- **Wind:** Light easterly winds, 10–15 km/h\n\n**Recommended actions:**\n1. Hold off on irrigation for the next 2 days\n2. Prepare drainage channels if rain exceeds 30 mm\n3. Spray fungicides *before* rain if crop shows any disease symptoms\n\n> ⚠️ *This is a local demo response. Connect internet for live weather data.*`;
  }

  if (q.includes("irrigat") || q.includes("water") || q.includes("paani")) {
    return `## 💧 Irrigation Advice for ${c}\n\nFor **${c}** in **${loc}** at this growth stage:\n\n**Recommended schedule:**\n- Irrigate every **7–10 days** during vegetative stage\n- Reduce to every **12–14 days** during grain filling\n- Avoid irrigation within **10 days of harvest**\n\n**Signs your crop needs water:**\n- Leaf rolling or wilting in the morning\n- Dry cracked soil beyond 5 cm depth\n- Yellowing of lower leaves\n\n**Water-saving tips:**\n1. Irrigate in the early morning or evening to reduce evaporation\n2. Use furrow irrigation for row crops\n3. Consider drip irrigation for orchards — saves up to **40%** water\n\n> ✅ *Adjust based on actual soil moisture and recent rainfall.*`;
  }

  if (q.includes("sow") || q.includes("plant") || q.includes("seed") || q.includes("kab")) {
    return `## 🌱 Sowing Guide for ${c} in ${loc}\n\n**Best sowing window:**\n- **${c}** is typically sown in **October–November** (Rabi) or **April–May** (Kharif) depending on variety\n\n**Seed rate:**\n- Certified seed: 50–60 kg/acre for wheat; varies by crop\n- Seed treatment with fungicide recommended before sowing\n\n**Soil preparation:**\n1. Deep plough 2–3 times before sowing\n2. Add 1–2 bags of DAP per acre at sowing time\n3. Ensure good soil moisture (field capacity)\n\n**Variety selection tips:**\n- Choose certified varieties from your provincial agriculture department\n- Heat/drought-tolerant varieties preferred in southern Punjab/Sindh\n\n> 📋 *Contact your local agriculture extension officer for region-specific recommendations.*`;
  }

  if (q.includes("fert") || q.includes("urea") || q.includes("dap") || q.includes("khad")) {
    return `## 🧪 Fertilizer Recommendations for ${c}\n\n**Nutrient schedule for ${c} (per acre):**\n\n| Stage | Fertilizer | Quantity |\n|-------|-----------|----------|\n| At sowing | DAP | 1–1.5 bags |\n| 3 weeks after | Urea | 1 bag |\n| Tillering/Branching | Urea | 1 bag |\n| Flowering | SOP (optional) | 0.5 bag |\n\n**Key tips:**\n1. Apply urea in the evening to reduce nitrogen loss\n2. Never apply fertilizer to dry soil — irrigate first\n3. Use zinc sulphate (1 kg/acre) if leaves show interveinal chlorosis\n4. Split urea applications are more efficient than a single large dose\n\n**Signs of deficiency:**\n- **Nitrogen (N):** Yellowing from lower leaves upward\n- **Phosphorus (P):** Purple/reddish leaf undersides\n- **Zinc (Zn):** Brown spots, stunted growth\n\n> ⚠️ *Soil test every 2–3 years for best results.*`;
  }

  if (
    q.includes("disease") ||
    q.includes("pest") ||
    q.includes("insect") ||
    q.includes("spray") ||
    q.includes("bimari")
  ) {
    return `## 🔍 Crop Disease & Pest Management for ${c}\n\n**Common threats for ${c} this season:**\n\n**1. Aphids (Tela/Mahu)**\n- *Signs:* Curled leaves, sticky honeydew, yellowing\n- *Action:* Spray Imidacloprid (Confidor) 250 ml/acre\n\n**2. Powdery Mildew / Rust**\n- *Signs:* White powdery or orange-brown spots on leaves\n- *Action:* Spray Propiconazole (Tilt 250EC) 250 ml/acre\n\n**3. Root Rot**\n- *Signs:* Wilting despite adequate irrigation, brown roots\n- *Action:* Improve drainage, drench with Metalaxyl\n\n**Preventive spray schedule:**\n1. First spray at 30 days after sowing (preventive)\n2. Second spray if disease pressure visible\n3. Stop sprays 2–3 weeks before harvest\n\n> 📸 *Share a photo of the affected plant for more accurate diagnosis.*`;
  }

  if (q.includes("price") || q.includes("mandi") || q.includes("rate") || q.includes("market")) {
    return `## 📊 Current Market Rates (Indicative)\n\n**${c} — Approximate Mandi Rates:**\n\n| Market | Rate (PKR/40 kg) |\n|--------|------------------|\n| Lahore | 4,200 – 4,500 |\n| Faisalabad | 4,100 – 4,400 |\n| Multan | 4,000 – 4,300 |\n| Karachi | 4,400 – 4,700 |\n\n**Market tips:**\n1. Sell in batches rather than all at once to average out price\n2. Store in dry, ventilated godowns if rates are low\n3. Check PASSCO and Punjab Food Authority support price before selling\n4. Register on **Pakistan Agricultural Storage & Services Corporation (PASSCO)** portal for government procurement\n\n**Government support price (2024–25):** PKR 3,900/40 kg (wheat)\n\n> 📱 *Call your nearest AMIS helpline or check the Punjab Agri Department app for real-time rates.*`;
  }

  if (
    q.includes("subsid") ||
    q.includes("scheme") ||
    q.includes("government") ||
    q.includes("loan")
  ) {
    return `## 🏛️ Government Schemes & Subsidies for Farmers\n\n**Currently active programs:**\n\n**1. Kissan Package (Punjab)**\n- Subsidized seeds, fertilizer, and pesticides\n- Apply at your district Agriculture Department office\n\n**2. ZTBL Agricultural Loans**\n- Short-term crop loans at reduced markup\n- Required: Land record (Fard), CNIC\n- Apply at nearest ZTBL branch\n\n**3. Prime Minister's Agriculture Package**\n- Solar tube well subsidies\n- Drip/sprinkler irrigation support\n\n**4. Crop Insurance (Fasal Bima)**\n- Covers crop loss from weather, pests, disease\n- Premium: 2–5% of sum insured\n\n**How to apply:**\n1. Visit your Tehsil Agriculture Office\n2. Bring: CNIC, Land record (Fard/Jamabandi), Bank account details\n3. Register on **Punjab Agriculture Department portal**: agripunjab.gov.pk\n\n> ✅ *Schemes vary by province. Contact your local Agriculture Extension Officer for the latest.*`;
  }

  if (q.includes("harvest") || q.includes("cut") || q.includes("kataai")) {
    return `## 🌾 Harvest Timing for ${c}\n\n**When to harvest ${c}:**\n\n**Visual indicators:**\n- Grain moisture: **14–16%** for safe storage\n- Crop color: Golden yellow (wheat), fully dried leaves (corn/maize)\n- Test: Bite a grain — it should be hard and not leave a mark\n\n**Recommended steps:**\n1. Stop irrigation **10–14 days** before harvest\n2. Harvest early morning to reduce grain shattering\n3. Combine/thresher recommended — reduces losses by 5–10% vs manual\n4. Clean and dry grain before storage\n\n**Post-harvest:**\n- Store in clean, dry gunny bags or silos\n- Use Phostoxin (Aluminium Phosphide) tablets for pest control in storage\n- Keep moisture below 12% for long-term storage\n\n> ⚠️ *Harvesting too early or too late both reduce income. Get grain tested at a local lab if unsure.*`;
  }

  // Default / farm plan response
  return `## 🌿 Today's Farm Advisory — ${c} in ${loc}\n\nAssalam-o-Alaikum! Here's your personalized farm plan:\n\n**Morning checklist:**\n1. ☀️ Walk your field and check for any pest/disease symptoms\n2. 💧 Check soil moisture — irrigate if the top 5 cm is dry\n3. 🌡️ Note temperature — spray only when below 35°C\n\n**This week's priorities for ${c}:**\n- Monitor for aphids and leaf rust (inspect underside of leaves)\n- Ensure adequate soil nitrogen — look for yellowing lower leaves\n- Record any unusual observations with a photo\n\n**Reminders:**\n- Keep your input receipts for subsidy claims\n- Check mandi rates before selling\n- Note this week's irrigation date\n\n**Quick tip:**\n> 🔑 *"Water at the right time, spray only when needed, and keep detailed records — these three habits can boost your income by 15–20%."*\n\nFeel free to ask about weather, diseases, fertilizers, market rates, or government schemes!\n\n> 🤖 *Running in local demo mode — connect internet for live AI responses.*`;
}

/** Simulate a streaming response by yielding words with a small delay */
async function* mockStream(text: string): AsyncGenerator<string> {
  const words = text.split(" ");
  for (const word of words) {
    yield word + " ";
    await new Promise<void>((r) => setTimeout(r, 18 + Math.random() * 22));
  }
}

/** Returns true when running on localhost / local network (no API backend) */
function isLocalhost(): boolean {
  const host = window.location.hostname;
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.startsWith("192.168.") ||
    host.startsWith("10.") ||
    host.startsWith("172.")
  );
}

// ---------------------------------------------------------------------------

const CROPS = [
  "Wheat", "Cotton", "Rice / Basmati", "Sugarcane", "Maize", "Potato", "Onion", "Tomato",
  "Chilli", "Mango", "Citrus / Kinnow", "Banana", "Guava", "Apple", "Grapes",
  "Sunflower", "Canola / Mustard", "Gram / Chickpea", "Lentil / Masoor", "Peanut",
  "Soybean", "Barley", "Sorghum / Jowar", "Millet / Bajra", "Fodder",
  "Vegetables (mixed)", "Orchard (mixed)", "Livestock / Dairy",
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
type Part =
  | { type: "text"; text: string }
  | { type: "image"; image: string };
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
    if (!file.type.startsWith("image/")) {
      toast.error("Please attach an image (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image is too large (max 10 MB).");
      return;
    }
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
    const nextMessages = [...messages, userMsg];
    setMessages([...nextMessages, { id: assistantId, role: "assistant", parts: [{ type: "text", text: "" }] }]);
    setInput("");
    setAttachment(null);
    setIsLoading(true);

    // Build request payload — send minimal required structure
    const payload = {
      messages: [{ role: 'user', content }],
      systemPrompt: '', // no extra system prompt for now
    };

    abortRef.current = new AbortController();

    /** Stream chunks from an async generator into the assistant bubble */
    const streamFromGenerator = async (gen: AsyncGenerator<string>) => {
      let acc = "";
      for await (const chunk of gen) {
        if (abortRef.current?.signal.aborted) break;
        acc += chunk;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, parts: [{ type: "text", text: acc }] } : m,
          ),
        );
      }
    };

    try {
      // -----------------------------------------------------------------------
      // Localhost: skip network round-trip and use the client-side mock stream
      // so the demo works without any backend / API key configuration.
      // -----------------------------------------------------------------------
      if (isLocalhost()) {
        const mockText = buildMockResponse(content, crop, location);
        await streamFromGenerator(mockStream(mockText));
        return;
      }

      // -----------------------------------------------------------------------
      // Production: call the real /api/chat endpoint
      // -----------------------------------------------------------------------
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content }],
          context: { crop, location, language }
        }),
        signal: abortRef.current.signal
      });

      if (!res.ok) {
        // Log non‑2xx status
        const errTxt = await res.text().catch(() => "");
        console.error(`[AssistantDemo] /api/chat error ${res.status}:`, errTxt);
        await streamFromGenerator(mockStream(buildMockResponse(content, crop, location)));
        return;
      }
      if (!res.body) {
        console.error("[AssistantDemo] /api/chat response missing body");
        await streamFromGenerator(mockStream(buildMockResponse(content, crop, location)));
        return;
      }

      // Stream the real response
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, parts: [{ type: "text", text: acc }] } : m)),
        );
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") {
        // User pressed stop — keep whatever was already streamed
        return;
      }
      // Network error (connection refused, etc.) → silent mock fallback
      console.warn("[AssistantDemo] Network error — falling back to local mock:", e);
      try {
        await streamFromGenerator(mockStream(buildMockResponse(content, crop, location)));
      } catch {
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }

  async function toggleRecording() {
    if (recording) {
      recorderRef.current?.stop();
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error("Voice recording is not supported in this browser.");
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
          const data = (await res.json()) as { text?: string; error?: string };
          if (!res.ok) throw new Error(data.error || "Transcription failed");
          if (data.text) setInput((prev) => (prev ? prev + " " + data.text : data.text!));
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
              <button
                type="button"
                onClick={useMyLocation}
                className="mt-2 text-[11px] font-medium text-primary hover:underline"
              >
                Use my location
              </button>
            </ControlCard>
            <ControlCard icon={<Sprout className="size-4" />} label="Crop">
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full bg-transparent text-sm font-medium outline-none"
              >
                {CROPS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </ControlCard>
            <ControlCard icon={<Languages className="size-4" />} label="Language">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-transparent text-sm font-medium outline-none"
              >
                {LANGUAGES.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </ControlCard>

            <div className="rounded-2xl border border-border bg-secondary/50 p-4 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">Try asking</p>
              <ul className="mt-2 space-y-1.5">
                {QUICK.slice(0, 4).map((q) => (
                  <li key={q}>
                    <button
                      type="button"
                      onClick={() => submit(q)}
                      className="text-left hover:text-foreground"
                    >
                      · {q}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div
            className="glass shadow-elevated overflow-hidden rounded-3xl"
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            onPaste={onPaste}
          >
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
                        return (
                          <span key={i} className="inline-flex gap-1">
                            <Dot /><Dot delay="0.15s" /><Dot delay="0.3s" />
                          </span>
                        );
                      }
                      return (
                        <div key={i} className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1.5 prose-ul:my-1.5">
                          <ReactMarkdown>{p.text}</ReactMarkdown>
                        </div>
                      );
                    }
                    return (
                      <img key={i} src={p.image} alt="attached" className="mt-1.5 max-h-48 rounded-lg" />
                    );
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
                  <button
                    type="button"
                    onClick={() => setAttachment(null)}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              )}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void submit();
                }}
                className="flex items-center gap-2 rounded-2xl border border-border bg-background px-2 py-1.5"
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                />
                <button
                  type="button"
                  aria-label="Attach photo"
                  onClick={() => fileRef.current?.click()}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-secondary"
                >
                  <ImagePlus className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label={recording ? "Stop recording" : "Record voice"}
                  onClick={toggleRecording}
                  disabled={transcribing}
                  className={`rounded-lg p-2 ${recording ? "bg-destructive text-destructive-foreground animate-pulse" : "text-muted-foreground hover:bg-secondary"}`}
                >
                  {transcribing ? <Loader2 className="size-4 animate-spin" /> : recording ? <Square className="size-4" /> : <Mic className="size-4" />}
                </button>
                {recording && (
                  <span className="text-xs font-medium text-destructive tabular-nums">
                    {Math.floor(recSecs / 60)}:{String(recSecs % 60).padStart(2, "0")}
                  </span>
                )}
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={attachment ? "Add a note about the photo…" : "Ask about your farm…"}
                  className="flex-1 bg-transparent px-1 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
                />
                <Button type="submit" size="sm" disabled={isLoading} className="rounded-xl">
                  <Send className="size-4" />
                </Button>
              </form>
              <p className="mt-1.5 px-1 text-[10px] text-muted-foreground">
                Drop or paste a photo, tap the mic to speak, or type. Advice is guidance — always confirm with a local agronomist for critical decisions.
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
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Bubble({ role, children }: { role: "assistant" | "user"; children: React.ReactNode }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-up`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary text-foreground rounded-bl-sm"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function Dot({ delay = "0s" }: { delay?: string }) {
  return <span style={{ animationDelay: delay }} className="inline-block size-1.5 rounded-full bg-muted-foreground/70 animate-blink" />;
}
