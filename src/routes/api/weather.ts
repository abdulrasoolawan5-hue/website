import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Startup check for Gemini key (shared across services)
console.log('GEMINI KEY LOADED:', !!process.env.VITE_GEMINI_API_KEY);

import { createFileRoute } from "@tanstack/react-router";
import { GoogleGenerativeAI } from "@google/generative-ai";

type GeoResult = { name: string; country: string; state?: string; lat: number; lon: number };

export const Route = createFileRoute("/api/weather")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const mode = url.searchParams.get("mode") ?? "forecast";
        // Load Weather API key with fallback
        let apiKey = process.env.VITE_WEATHER_API_KEY || process.env.WEATHER_API_KEY;
        console.log("Weather API Key Status:", apiKey ? `EXISTS (Length: ${apiKey.length})` : "MISSING");
        if (!apiKey) {
          console.error("Weather API key missing in environment");
          return Response.json({ error: "VITE_WEATHER_API_KEY is missing from .env.local on backend" }, { status: 500 });
        }

        try {
          if (mode === "search") {
            const q = url.searchParams.get("q")?.trim();
            if (!q || q.length < 2) return Response.json({ results: [] });
            const r = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=6&appid=${apiKey}`);
            if (!r.ok) return Response.json({ error: "Search failed" }, { status: 502 });
            const data = (await r.json()) as GeoResult[];
            return Response.json({
              results: data.map((g) => ({
                name: g.name,
                country: g.country,
                state: g.state,
                lat: g.lat,
                lon: g.lon,
              })),
            });
          }

          const lat = url.searchParams.get("lat");
          const lon = url.searchParams.get("lon");
          const crop = url.searchParams.get("crop") ?? "general crops";
          const lang = url.searchParams.get("lang") ?? "English";
          if (!lat || !lon) return Response.json({ error: "lat/lon required" }, { status: 400 });

          const [curRes, fcRes] = await Promise.all([
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`),
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`),
          ]);
          if (!curRes.ok || !fcRes.ok) return Response.json({ error: "Weather API failed" }, { status: 502 });
          const current = await curRes.json();
          const forecast = await fcRes.json();

          // 5‑day summary at noon slots
          type FcEntry = {
            dt_txt: string;
            main: { temp: number; feels_like: number; humidity: number };
            wind: { speed: number };
            rain?: { "3h"?: number };
            weather: Array<{ description: string; icon: string }>;
          };
          const daily = (forecast.list as FcEntry[])
            .filter((e) => e.dt_txt.includes("12:00:00"))
            .slice(0, 5)
            .map((e) => ({
              date: e.dt_txt,
              temp: e.main.temp,
              feels: e.main.feels_like,
              humidity: e.main.humidity,
              wind: e.wind.speed,
              rain: e.rain?.["3h"] ?? 0,
              desc: e.weather[0]?.description ?? "",
              icon: e.weather[0]?.icon ?? "01d",
            }));

          // Optional Gemini advice generation
          let advice = "";
          const geminiKey = process.env.VITE_GEMINI_API_KEY;
          if (geminiKey) {
            try {
              const genAI = new GoogleGenerativeAI(geminiKey);
              const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
              const summary = `Current: ${current.main.temp}°C, humidity ${current.main.humidity}%, wind ${current.wind.speed} m/s, ${current.weather[0].description}. Next 5 days: ${daily
                .map((d) => `${d.date.slice(5, 10)} ${d.temp}°C, ${d.desc}, rain ${d.rain}mm, wind ${d.wind}m/s`)
                .join("; ")}.`;
              const result = await model.generateContent(summary);
              advice = result.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
            } catch (e) {
              console.error("Gemini advice generation error", e);
            }
          } else {
            console.warn("Gemini API key not set; advice will be empty.");
          }

          return Response.json({
            place: current.name,
            current: {
              temp: current.main.temp,
              feels: current.main.feels_like,
              humidity: current.main.humidity,
              wind: current.wind.speed,
              desc: current.weather[0]?.description,
              icon: current.weather[0]?.icon,
              sunrise: current.sys.sunrise,
              sunset: current.sys.sunset,
            },
            daily,
            advice,
          });
        } catch (e) {
          console.error(e);
          return Response.json({ error: "Weather failed" }, { status: 500 });
        }
      },
    },
  },
});
