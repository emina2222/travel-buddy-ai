"use client";

import { useState } from "react";
import TravelForm from "./components/TravelForm";
import Timeline from "./components/Timeline";
import {TravelPlanRequest, TravelPlanResponse} from "@/app/api/plan/types";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<TravelPlanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generate(req: TravelPlanRequest) {
    setLoading(true);
    setError(null);
    setPlan(null);

    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
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

          <TravelForm onGenerate={generate} loading={loading} />

          {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
          )}

          {plan && <Timeline plan={plan} />}
        </div>
      </main>
  );
}
