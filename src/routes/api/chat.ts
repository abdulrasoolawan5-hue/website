import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs'; // keep for potential fallback reading if needed
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { createFileRoute } from "@tanstack/react-router";
import { streamText, type ModelMessage } from "ai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Startup check
console.log("GEMINI KEY LOADED:", !!process.env.VITE_GEMINI_API_KEY);

type ChatContext = { location?: string; crop?: string; language?: string; weather?: string };
type ChatMessage = {
  role: "user" | "assistant";
  content:
    | string
    | Array<
        | { type: "text"; text: string }
        | { type: "image"; image: string }
      >;
};

function buildSystemPrompt(ctx: ChatContext) {
  return `You are Sujaag Hari, a warm, practical AI farming assistant for Pakistani farmers.

Farmer context:
- Location: ${ctx.location || "not specified"}
- Crop: ${ctx.crop || "not specified"}
- Preferred language: ${ctx.language || "English"}
${ctx.weather ? `- Weather: ${ctx.weather}` : ''}

Rules:
- Always reply in the farmer's preferred language. If Urdu, use Urdu script. If Punjabi/Sindhi/Pashto, use their native script.
- Be concise, practical, and specific. Use short paragraphs, bullet points, and numbers.
- Cover topics: weather, sowing, irrigation, disease/pest identification, fertilizer, market rates, government schemes, harvest timing.
- If an image is attached, analyze it carefully for crop/leaf disease, pest, deficiency, or growth stage. Give: (1) likely diagnosis with confidence, (2) 3–5 action steps, (3) when to upscale to a human agronomist.
- Never mention model names, providers, or backend systems. You are simply "Sujaag Hari".
- If uncertain, say so and suggest a photo or a follow‑up question.`;
}

/** Build a rich, context‑aware mock farming advice response for demo/fallback use */
function buildServerMockResponse(messages: ChatMessage[], ctx: ChatContext): string {
  const loc = ctx.location || "your area";
  const crop = ctx.crop || "your crop";
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const rawContent = lastUser?.content ?? "";
  const userText = typeof rawContent === "string"
    ? rawContent
    : rawContent
        .filter((p) => p.type === "text")
        .map((p) => (p as { type: "text"; text: string }).text)
        .join(" ");
  const q = userText.toLowerCase();

  if (q.includes("weather") || q.includes("forecast") || q.includes("rain")) {
    return `## 🌤️ Weather Outlook for ${loc}\n\nBased on typical seasonal patterns:\n\n- **Next 3 days:** Partly cloudy, 28–34°C, low chance of rain\n- **Day 4–7:** Light showers possible — ideal for ${crop}\n- **Wind:** Light easterly, 10–15 km/h\n\n**Actions:**\n1. Hold off irrigation for 2 days\n2. Prepare drainage channels if rain exceeds 30 mm\n3. Spray fungicides *before* rain if disease symptoms visible\n\n> ⚠️ *Demo mode — add LOVABLE_API_KEY for live AI responses.*`;
  }
  if (q.includes("irrigat") || q.includes("water") || q.includes("paani")) {
    return `## 💧 Irrigation Advice for ${crop}\n\n- Irrigate every **7–10 days** (vegetative stage)\n- Every **12–14 days** during grain filling\n- Stop **10 days before harvest**\n\n**Signs crop needs water:** leaf rolling, cracked soil, yellowing lower leaves.\n\n> ✅ *Demo mode — add LOVABLE_API_KEY for live AI responses.*`;
  }
  if (q.includes("fert") || q.includes("urea") || q.includes("dap") || q.includes("khad")) {
    return `## 🧪 Fertilizer Guide for ${crop}\n\n| Stage | Fertilizer | Qty/acre |\n|-------|-----------|----------|\n| Sowing | DAP | 1–1.5 bags |\n| 3 weeks | Urea | 1 bag |\n| Tillering | Urea | 1 bag |\n\n**Tips:** Apply urea in the evening; never on dry soil; add zinc sulphate if interveinal chlorosis appears.\n\n> ⚠️ *Demo mode — add LOVABLE_API_KEY for live AI responses.*`;
  }
  if (q.includes("disease") || q.includes("pest") || q.includes("bimari") || q.includes("spray")) {
    return `## 🔍 Pest & Disease Alert for ${crop}\n\n**Aphids:** Spray Imidacloprid 250 ml/acre\n**Rust/Mildew:** Spray Propiconazole 250 ml/acre\n**Root Rot:** Improve drainage + Metalaxyl drench\n\nStop sprays 2–3 weeks before harvest.\n\n> 📸 *Share a photo for accurate diagnosis. Demo mode — add LOVABLE_API_KEY for live AI.*`;
  }
  if (q.includes("price") || q.includes("mandi") || q.includes("rate")) {
    return `## 📊 Mandi Rates — ${crop} (Indicative)\n\n| Market | PKR/40 kg |\n|--------|----------|\n| Lahore | 4,200–4,500 |\n| Multan | 4,000–4,300 |\n| Karachi | 4,400–4,700 |\n\nGovernment support price: **PKR 3,900/40 kg** (wheat 2024–25).\n\n> 📱 *Demo mode — add LOVABLE_API_KEY for live AI responses.*`;
  }
  // Default farm plan
  return `## 🌿 Farm Advisory — ${crop} in ${loc}\n\nAssalam-o-Alaikum! Here is your daily farm plan:\n\n**Morning checklist:**\n1. Walk the field — check for pests or disease\n2. Test soil moisture — irrigate if top 5 cm is dry\n3. Record any observations (a photo helps!)\n\n**This week:** monitor for aphids, ensure nitrogen levels, check mandi rates.\n\n> 🤖 *Running in demo mode. Add LOVABLE_API_KEY to your environment for live AI‑powered responses.*`;
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let bodyRaw: any;
        try {
          bodyRaw = await request.json();
        } catch (err) {
          console.error("Payload Parse Error:", err);
          return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
        }
        // If raw body is a string (e.g., plain text), attempt JSON parse
        const body = typeof bodyRaw === "string"
          ? (() => {
              try { return JSON.parse(bodyRaw); }
              catch { return { messages: [] }; }
            })()
          : bodyRaw;
        if (!Array.isArray(body?.messages)) {
          return new Response("messages required", { status: 400 });
        }

        // Load Gemini API key (dotenv already configured)
        let apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        console.log("Gemini API Key Status:", apiKey ? `EXISTS (Length: ${apiKey.length})` : "MISSING");
        if (!apiKey) {
          return Response.json({ error: "VITE_GEMINI_API_KEY is missing from .env.local on backend" }, { status: 500 });
        }

        const requestedModel = body.model?.trim();
        const fallbackModel = "gemini-1.5-flash";
        const modelName = requestedModel || fallbackModel;

        // Fetch real-time weather if location is provided
        let weatherInfo = '';
        if (body.context?.location) {
          try {
            const weatherKey = process.env.VITE_WEATHER_API_KEY;
            if (weatherKey) {
              const weatherRes = await fetch(`https://api.weatherapi.com/v1/current.json?key=${weatherKey}&q=${encodeURIComponent(body.context.location)}`);
              if (weatherRes.ok) {
                const data = await weatherRes.json();
                const { temp_c, condition, humidity } = data.current;
                weatherInfo = `Current weather at ${body.context.location}: ${temp_c}°C, ${condition.text}, humidity ${humidity}%`;
              }
            }
          } catch (e) {
            console.warn('Weather fetch failed', e);
          }
        }

        try {
          const genAI = new GoogleGenerativeAI(apiKey);
          // Pass system instruction via getGenerativeModel and map assistant role to model
          const model = genAI.getGenerativeModel({ model: modelName, systemInstruction: buildSystemPrompt({ ...(body.context ?? {}), weather: weatherInfo }) });
          const geminiMessages = body.messages.map((m) => {
            const role = m.role === "assistant" ? "model" : m.role;
            const parts = typeof m.content === "string"
              ? [{ text: m.content }]
              : m.content.map((p) =>
                  p.type === "text"
                    ? { text: p.text }
                    : { inlineData: { mimeType: "image/png", data: p.image } },
                );
            return { role, parts };
          });
          const result = await model.generateContentStream(geminiMessages);
          const stream = new ReadableStream({
            async start(controller) {
              for await (const chunk of result.stream) {
                if (typeof chunk.text === "function") {
                  const txt = chunk.text();
                  controller.enqueue(new TextEncoder().encode(txt));
                }
              }
              controller.close();
            },
          });
            return new Response(stream, { status: 200, headers: { "content-type": "text/plain; charset=utf-8" } });
          } catch (e) {
            console.error("Gemini generation error", e);
            return Response.json({ error: "Gemini generation failed" }, { status: 500 });
        }
      },
    },
  },
});
