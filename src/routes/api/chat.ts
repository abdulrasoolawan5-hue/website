import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";

export const APIRoute = createAPIFileRoute("/api/chat")({
  POST: async ({ request }) => {
    try {
      const body = await request.json();
      const userPrompt = body.prompt || body.message || "";

      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return json(
          { text: "Error: GEMINI_API_KEY is missing in .env.local file." },
          { status: 400 }
        );
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: userPrompt }] }],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return json(
          { text: `Gemini API Error: ${data.error?.message || "Invalid Key or Request"}` },
          { status: response.status }
        );
      }

      const reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
      return json({ text: reply });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return json({ text: `Server error: ${message}` }, { status: 500 });
    }
  },
});
