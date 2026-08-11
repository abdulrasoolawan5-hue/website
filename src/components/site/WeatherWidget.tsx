import { SectionHeader } from "./Problem";
import { useEffect, useRef, useState } from "react";
import { MapPin, Loader2, Search, Droplets, Wind, Sunrise, Sunset } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Place = { name: string; country: string; state?: string; lat: number; lon: number };
type Forecast = {
  place: string;
  current: {
    temp: number;
    feels: number;
    humidity: number;
    wind: number;
    desc: string;
    icon: string;
    sunrise: number;
    sunset: number;
  };
  daily: Array<{
    date: string;
    temp: number;
    humidity: number;
    wind: number;
    rain: number;
    desc: string;
    icon: string;
  }>;
  advice: string;
};

const CROPS = ["Wheat", "Cotton", "Rice", "Sugarcane", "Maize", "Vegetables", "Orchard"];

export function WeatherWidget() {
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [place, setPlace] = useState<Place | null>(null);
  const [crop, setCrop] = useState("Wheat");
  const [data, setData] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!q || q.length < 2 || place) {
      setSuggestions([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const r = await fetch(`/api/weather?mode=search&q=${encodeURIComponent(q)}`);
        const d = await r.json();
        setSuggestions(d.results ?? []);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [q, place]);

  async function loadForecast(p: Place, cropName = crop) {
    setLoading(true);
    setData(null);
    try {
      const r = await fetch(
        `/api/weather?lat=${p.lat}&lon=${p.lon}&crop=${encodeURIComponent(cropName)}`,
      );
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Weather failed");
      setData(d);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function pick(p: Place) {
    setPlace(p);
    setQ(`${p.name}${p.state ? ", " + p.state : ""}, ${p.country}`);
    setSuggestions([]);
    void loadForecast(p);
  }

  function changeCrop(c: string) {
    setCrop(c);
    if (place) void loadForecast(place, c);
  }

  return (
    <section id="weather" className="border-y border-border/60 bg-gradient-to-b from-secondary/30 to-background py-20 sm:py-28">
      <div className="container-page">
        <SectionHeader
          eyebrow="Weather"
          title="Real weather. Real advice for your field."
          desc="Enter any village, town, or city. Get a forecast turned into simple actions for your crop."
        />

        <div className="mx-auto mt-10 max-w-5xl">
          <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
            <div className="relative">
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-soft">
                <Search className="size-4 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setPlace(null);
                  }}
                  placeholder="Search village, town, tehsil, district or city…"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                {searching && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
              </div>
              {suggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-elevated">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => pick(s)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-secondary"
                    >
                      <MapPin className="size-3.5 text-muted-foreground" />
                      <span className="font-medium">{s.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {s.state ? s.state + ", " : ""}
                        {s.country}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <select
              value={crop}
              onChange={(e) => changeCrop(e.target.value)}
              className="rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium shadow-soft outline-none"
            >
              {CROPS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          {loading && (
            <div className="mt-8 flex justify-center">
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          )}

          {data && (
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
              <div className="glass shadow-elevated rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Now in</div>
                    <div className="font-display text-2xl font-bold">{data.place}</div>
                  </div>
                  <img
                    src={`https://openweathermap.org/img/wn/${data.current.icon}@2x.png`}
                    alt=""
                    className="size-20"
                  />
                </div>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="font-display text-5xl font-bold">{Math.round(data.current.temp)}°</span>
                  <span className="text-sm capitalize text-muted-foreground">{data.current.desc}</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Feels like {Math.round(data.current.feels)}°C</div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <Stat icon={<Droplets className="size-4 text-sky" />} label="Humidity" value={`${data.current.humidity}%`} />
                  <Stat icon={<Wind className="size-4 text-sky" />} label="Wind" value={`${data.current.wind.toFixed(1)} m/s`} />
                  <Stat icon={<Sunrise className="size-4 text-amber-500" />} label="Sunrise" value={new Date(data.current.sunrise * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} />
                  <Stat icon={<Sunset className="size-4 text-orange-500" />} label="Sunset" value={new Date(data.current.sunset * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} />
                </div>

                <div className="mt-5 grid grid-cols-5 gap-2">
                  {data.daily.map((d) => (
                    <div key={d.date} className="rounded-xl border border-border bg-background p-2 text-center">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {new Date(d.date).toLocaleDateString([], { weekday: "short" })}
                      </div>
                      <img src={`https://openweathermap.org/img/wn/${d.icon}.png`} alt="" className="mx-auto size-8" />
                      <div className="text-sm font-semibold">{Math.round(d.temp)}°</div>
                      {d.rain > 0 && (
                        <div className="text-[10px] text-sky">{d.rain.toFixed(1)}mm</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass shadow-elevated rounded-3xl p-6">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
                  Farming advice · {crop}
                </div>
                {data.advice ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1.5 prose-ul:my-2">
                    <ReactMarkdown>{data.advice}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Advice will appear here once the forecast loads.
                  </p>
                )}
              </div>
            </div>
          )}

          {!data && !loading && (
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Start by searching your location above.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-background/60 px-3 py-2">
      {icon}
      <div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-sm font-semibold">{value}</div>
      </div>
    </div>
  );
}
