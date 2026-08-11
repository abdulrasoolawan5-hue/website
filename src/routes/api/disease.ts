import { createFileRoute } from "@tanstack/react-router";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { generateText } from "ai";

export const Route = createFileRoute("/api/disease")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return Response.json({ error: "AI not configured" }, { status: 500 });

        try {
          const body = (await request.json()) as {
            imageDataUrl: string;
            crop?: string;
            language?: string;
            notes?: string;
          };
          if (!body.imageDataUrl?.startsWith("data:image/"))
            return Response.json({ error: "Valid image required" }, { status: 400 });

          const gateway = createLovableAiGatewayProvider(key);
          const { text } = await generateText({
            model: gateway("google/gemini-3.6-flash"),
            system: `You are Sujaag Hari, an expert plant pathologist for Pakistani farms. Analyze the photo and reply in ${body.language ?? "English"}. Format strictly as:

**Diagnosis:** <name> (confidence: low/medium/high)
**What you see:** 1-2 sentences on visible symptoms
**Immediate actions:** 3-5 short bullets (product names + dose where relevant)
**Prevention:** 2-3 bullets
**When to call an agronomist:** 1 sentence

Never mention models, providers, or backend systems.`,
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: `Crop: ${body.crop ?? "unknown"}. ${body.notes ? "Farmer notes: " + body.notes : ""}`,
                  },
                  { type: "image", image: body.imageDataUrl },
                ],
              },
            ],
          });

          return Response.json({ result: text });
        } catch (e) {
          console.error("disease error", e);
          return Response.json({ error: "Analysis failed" }, { status: 500 });
        }
      },
    },
  },
});
