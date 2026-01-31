"use client";

import { useState } from "react";
import {TravelPlanRequest} from "@/app/api/plan/types";

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

type Props = {
    onGenerateAction: (req: TravelPlanRequest) => void;
    loading: boolean;
};

export default function TravelForm({ onGenerateAction, loading }: Props) {
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

    function toggleInterest(i: string) {
        setForm((f) => {
            const exists = f.interests.includes(i);
            return {
                ...f,
                interests: exists
                    ? f.interests.filter((x) => x !== i)
                    : [...f.interests, i],
            };
        });
    }

    return (
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 grid gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* From */}
                <label className="grid gap-1">
                    <span className="text-sm">From</span>
                    <input
                        className="border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        value={form.from}
                        onChange={(e) => setForm({ ...form, from: e.target.value })}
                    />
                </label>

                {/* To */}
                <label className="grid gap-1">
                    <span className="text-sm">To</span>
                    <input
                        className="border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        value={form.to}
                        onChange={(e) => setForm({ ...form, to: e.target.value })}
                    />
                </label>

                {/* Start date */}
                <label className="grid gap-1">
                    <span className="text-sm">Start date</span>
                    <input
                        type="date"
                        className="border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        value={form.startDate}
                        onChange={(e) =>
                            setForm({ ...form, startDate: e.target.value })
                        }
                    />
                </label>

                {/* Days */}
                <div className="grid gap-1">
                    <span className="text-sm">Days</span>
                    <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white">
                        <button
                            type="button"
                            onClick={() =>
                                setForm({ ...form, days: Math.max(1, form.days - 1) })
                            }
                            className="px-3 py-2 text-lg text-slate-500 hover:text-slate-900"
                        >
                            −
                        </button>

                        <div className="px-4 py-2 text-sm font-medium">
                            {form.days}
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setForm({ ...form, days: Math.min(10, form.days + 1) })
                            }
                            className="px-3 py-2 text-lg text-slate-500 hover:text-slate-900"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Budget */}
                <div className="grid gap-1">
                    <span className="text-sm">Budget</span>
                    <div className="inline-flex w-full rounded-xl border border-slate-200 bg-slate-100 p-1">
                        {["low", "medium", "high"].map((b) => (
                            <button
                                key={b}
                                type="button"
                                onClick={() =>
                                    setForm({ ...form, budget: b as any })
                                }
                                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
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

                {/* Style */}
                <div className="grid gap-1">
                    <span className="text-sm">Travel style</span>
                    <div className="inline-flex w-full rounded-xl border border-slate-200 bg-slate-100 p-1">
                        {["relaxed", "balanced", "packed"].map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() =>
                                    setForm({ ...form, style: s as any })
                                }
                                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                                    form.style === s
                                        ? "bg-white shadow text-slate-900"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Interests */}
            <div className="grid gap-2">
                <div className="text-sm">Interests</div>
                <div className="flex flex-wrap gap-2">
                    {INTERESTS.map((i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => toggleInterest(i)}
                            className={`px-4 py-1.5 rounded-full border text-sm font-medium transition ${
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

            {/* Notes */}
            <label className="grid gap-1">
                <span className="text-sm">Extra notes</span>
                <textarea
                    className="border border-slate-200 rounded-xl p-2.5 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-slate-300"
                    value={form.notes ?? ""}
                    onChange={(e) =>
                        setForm({ ...form, notes: e.target.value })
                    }
                />
            </label>

            <button
                onClick={() => onGenerateAction(form)}
                disabled={loading}
                className="mt-2 inline-flex items-center justify-center rounded-xl bg-slate-900 text-white px-6 py-2.5 font-medium transition hover:bg-slate-800 disabled:opacity-60"
            >
                {loading ? "Generating timeline..." : "Generate plan"}
            </button>
        </div>
    );
}
