import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";

export const APIRoute = createAPIFileRoute("/api/chat")({
  POST: async ({ request }) => {
    try {
      const body = await request.json();

      // Client sends: { messages: [{ role: "user", content: "..." }], context: { crop, location, language } }
      const messages: { role: string; content: string }[] = body.messages ?? [];
      const lastUserMessage = messages.findLast((m) => m.role === "user");
      const userPrompt = lastUserMessage?.content?.trim() ?? "";
      const context = body.context ?? {};

      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return new Response("Error: GEMINI_API_KEY is missing in environment.", {
          status: 400,
          headers: { "Content-Type": "text/plain" },
        });
      }

      if (!userPrompt) {
        return new Response("Error: No message provided.", {
          status: 400,
          headers: { "Content-Type": "text/plain" },
        });
      }

      // Build a system-style preamble so Gemini is aware of the farm context
      const systemInfo = [
        "You are Sujaag Hari, an expert agricultural assistant for Pakistani farmers.",
        context.crop ? `The farmer is growing: ${context.crop}.` : "",
        context.location ? `Their location is: ${context.location}.` : "",
        context.language && context.language !== "English"
          ? `Reply in ${context.language}.`
          : "Reply in English.",
      ]
        .filter(Boolean)
        .join(" ");

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: `${systemInfo}\n\n${userPrompt}` }],
              },
            ],
          }),
        }
      );

      const data = await geminiRes.json();

      if (!geminiRes.ok) {
        const errMsg = data.error?.message ?? "Invalid key or request";
        return new Response(`Gemini API Error: ${errMsg}`, {
          status: geminiRes.status,
          headers: { "Content-Type": "text/plain" },
        });
      }

      const reply: string =
        data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response received.";

      // Return plain text so the client can stream-read it directly
      return new Response(reply, {
        status: 200,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return new Response(`Server error: ${message}`, {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      });
    }
  },
});
