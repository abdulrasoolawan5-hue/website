import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(7).max(20),
  location: z.string().trim().max(80).optional(),
  crop: z.string().trim().max(80).optional(),
  message: z.string().trim().min(3).max(1000),
});

export const Route = createFileRoute("/api/whatsapp")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const webhook = process.env.N8N_WEBHOOK_URL;
        if (!webhook) return Response.json({ error: "WhatsApp not configured" }, { status: 500 });

        try {
          const body = await request.json();
          const parsed = schema.safeParse(body);
          if (!parsed.success)
            return Response.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });

          const res = await fetch(webhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              source: "sujaag-hari-web",
              receivedAt: new Date().toISOString(),
              ...parsed.data,
            }),
          });
          if (!res.ok) {
            const txt = await res.text();
            console.error("n8n webhook error", res.status, txt);
            return Response.json({ error: "Delivery failed" }, { status: 502 });
          }
          return Response.json({ ok: true });
        } catch (e) {
          console.error(e);
          return Response.json({ error: "Delivery failed" }, { status: 500 });
        }
      },
    },
  },
});
