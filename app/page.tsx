"use client";

import { useState } from "react";
import {TimelineItem, TravelPlanRequest, TravelPlanResponse} from "@/app/api/plan/types";

const INTERESTS = [
  "museums",
  "coffee",
  "architecture",
  "food",
  "parks",
  "shopping",
  "classical music",
  "history",
];

function iconFor(type: TimelineItem["type"]) {
  switch (type) {
    case "transport": return "🚆";
    case "sightseeing": return "🏛️";
    case "food": return "🍽️";
    case "free-time": return "🕰️";
    case "evening": return "🎶";
    case "hotel": return "🏨";
    default: return "📌";
  }
}

export default function Home() {
  const [form, setForm] = useState<TravelPlanRequest>({
    from: "Belgrade",
    to: "Vienna",
    startDate: "2026-04-12",
    days: 3,
    budget: "medium",
    style: "balanced",
    interests: ["coffee", "architecture", "food"],
    notes: "Prefer walkable areas. Include a cozy cafe each day.",
  });

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<TravelPlanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    setPlan(null);

    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Request failed");
        return;
      }
      setPlan(data);
    } catch (e: any) {
      setError(e?.message ?? "Network error");
    } finally {
      setLoading(false);
    }
  }

  function toggleInterest(i: string) {
    setForm((f) => {
      const exists = f.interests.includes(i);
      return { ...f, interests: exists ? f.interests.filter(x => x !== i) : [...f.interests, i] };
    });
  }

  return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-6">
        <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight">
            Travel Buddy AI
          </h1>
          <p className="text-slate-600 mt-2 max-w-2xl">
            Generate a realistic, day-by-day travel timeline with transport, sightseeing, free time, and meals.
          </p>
        </div>
          
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 grid gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="grid gap-1">
              <span className="text-sm">From</span>
              <input className="border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-slate-300" value={form.from}
                     onChange={(e) => setForm({ ...form, from: e.target.value })} />
            </label>

            <label className="grid gap-1">
              <span className="text-sm">To</span>
              <input className="border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-slate-300" value={form.to}
                     onChange={(e) => setForm({ ...form, to: e.target.value })} />
            </label>

            <label className="grid gap-1">
              <span className="text-sm">Start date</span>
              <input type="date" className="border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-slate-300" value={form.startDate}
                     onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </label>

            <label className="grid gap-1">
              <span className="text-sm">Days</span>
              <input type="number" min={1} max={10} className="border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-slate-300" value={form.days}
                     onChange={(e) => setForm({ ...form, days: Number(e.target.value) })} />
            </label>

            <label className="grid gap-1">
              <div className="grid gap-1">
                <span className="text-sm">Budget</span>
                <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1">
                  {["low", "medium", "high"].map((b) => (
                      <button
                          key={b}
                          type="button"
                          onClick={() => setForm({ ...form, budget: b as any })}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                              form.budget === b
                                  ? "bg-white shadow text-slate-900"
                                  : "text-slate-600 hover:text-slate-900"
                          }`}
                      >
                        {b.charAt(0).toUpperCase() + b.slice(1)}
                      </button>
                  ))}
                </div>
              </div>
            </label>

            <label className="grid gap-1">
              <span className="text-sm">Style</span>
              <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1">
                {["relaxed", "balanced", "packed"].map((s) => (
                    <button
                        key={s}
                        type="button"
                        onClick={() => setForm({ ...form, style: s as any })}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            form.style === s
                                ? "bg-white shadow text-slate-900"
                                : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                ))}
              </div>
            </label>
          </div>

          <div className="grid gap-2">
            <div className="text-sm">Interests</div>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((i) => (
                  <button
                      key={i}
                      type="button"
                      onClick={() => toggleInterest(i)}
                      className={`px-3 py-1.5 rounded-full border text-sm transition ${
                          form.interests.includes(i)
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                  >
                    {i}
                  </button>
              ))}
            </div>
          </div>

          <label className="grid gap-1">
            <span className="text-sm">Extra notes (optional)</span>
            <textarea className="border rounded-xl p-2 min-h-[80px]" value={form.notes ?? ""}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </label>

          <button
              onClick={generate}
              disabled={loading}
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-slate-900 text-white px-6 py-2.5 font-medium transition hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate plan"}
          </button>

          {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
          )}
        </div>

        {plan && (
            <section className="mt-12 grid gap-8">
              <div className="flex items-end justify-between">
                <h2 className="text-xl font-semibold">{plan.destination}</h2>
                <span className="text-sm opacity-70">Currency: {plan.currency}</span>
              </div>

              {plan.days.map((day) => (
                  <div
                      key={day.date}
                      className="relative rounded-3xl border border-slate-200 bg-white shadow-sm p-6"
                  >
                    <h3 className="text-lg font-semibold tracking-tight">
                      {day.date}
                    </h3>
                    <div className="mt-4 grid gap-4">
                      {day.items.map((it, idx) => (
                          <div key={idx} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg">
                                {iconFor(it.type)}
                              </div>
                              {idx !== day.items.length - 1 && (
                                  <div className="w-px flex-1 bg-slate-200 mt-1" />
                              )}
                            </div>

                            <div className="flex-1 pb-2">
                              <div className="text-sm text-slate-500">
                                {it.time}
                              </div>
                              <div className="font-medium">
                                {it.title}
                              </div>
                              <div className="text-sm text-slate-700 mt-0.5">
                                {it.description}
                              </div>
                              {it.location && (
                                  <div className="text-sm text-slate-500 mt-1">
                                    📍 {it.location}
                                  </div>
                              )}
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>
              ))}
            </section>
        )}
        </div>
      </main>
  );
}
