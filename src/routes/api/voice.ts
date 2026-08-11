import { createFileRoute } from "@tanstack/react-router";
import { GATEWAY_BASE } from "@/lib/ai-gateway.server";

export const Route = createFileRoute("/api/voice")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return Response.json({ error: "AI not configured" }, { status: 500 });

        try {
          const form = await request.formData();
          const file = form.get("file");
          if (!(file instanceof Blob)) {
            return Response.json({ error: "audio file required" }, { status: 400 });
          }
          const upstream = new FormData();
          upstream.append("model", "openai/gpt-4o-mini-transcribe");
          upstream.append("file", file, "recording.webm");

          const res = await fetch(`${GATEWAY_BASE}/audio/transcriptions`, {
            method: "POST",
            headers: { "Lovable-API-Key": key },
            body: upstream,
          });
          if (!res.ok) {
            const txt = await res.text();
            console.error("transcribe failed", res.status, txt);
            return Response.json({ error: "Transcription failed" }, { status: 502 });
          }
          const data = (await res.json()) as { text?: string };
          return Response.json({ text: data.text ?? "" });
        } catch (e) {
          console.error(e);
          return Response.json({ error: "Voice failed" }, { status: 500 });
        }
      },
    },
  },
});
