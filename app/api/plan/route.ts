import { NextResponse } from "next/server";
import {TravelPlanRequest, TravelPlanResponse} from "@/app/api/plan/types";
import {buildPrompt} from "@/app/api/plan/promptBuilder";

function isRecord(v: unknown): v is Record<string, unknown> {
    return typeof v === "object" && v !== null;
}

function basicValidatePlan(plan: unknown): plan is TravelPlanResponse {
    if (!isRecord(plan)) return false;
    if (typeof plan.destination !== "string") return false;
    if (typeof plan.currency !== "string") return false;
    if (typeof plan.estimatedExpense !== "number") return false;
    if (!Array.isArray(plan.days)) return false;

    for (const day of plan.days) {
        if (!isRecord(day) || typeof day.date !== "string" || !Array.isArray(day.items)) {
            return false;
        }
        for (const item of day.items) {
            if (
                !isRecord(item) ||
                typeof item.time !== "string" ||
                typeof item.title !== "string" ||
                typeof item.description !== "string" ||
                typeof item.type !== "string"
            ) {
                return false;
            }
        }
    }

    return true;
}

export async function POST(req: Request) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        return NextResponse.json(
            { error: "Missing OPENROUTER_API_KEY" },
            { status: 500 }
        );
    }

    let body: TravelPlanRequest;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (!body?.from || !body?.to || !body?.startDate || !body?.days) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const prompt = buildPrompt(body);

    const orRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            // Optional but recommended by OpenRouter
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "TripTimeline AI",
        },
        body: JSON.stringify({
            model: "deepseek/deepseek-r1", // or: "mistralai/mistral-7b-instruct"
            messages: [
                { role: "system", content: "You output only JSON that matches the required schema." },
                { role: "user", content: prompt }
            ],
            temperature: 0.6
        }),
    });

    if (!orRes.ok) {
        const errText = await orRes.text();
        return NextResponse.json(
            {
                error: "OpenRouter API error",
                status: orRes.status,
                detail: errText.slice(0, 800),
            },
            { status: 502 }
        );
    }

    const data = await orRes.json();

    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== "string") {
        return NextResponse.json(
            { error: "Unexpected OpenRouter response shape" },
            { status: 502 }
        );
    }

    let plan: unknown;
    try {
        plan = JSON.parse(content);
    } catch {
        return NextResponse.json(
            { error: "Model did not return valid JSON", raw: content.slice(0, 800) },
            { status: 502 }
        );
    }

    if (!basicValidatePlan(plan)) {
        return NextResponse.json(
            { error: "Plan JSON failed validation", raw: plan },
            { status: 502 }
        );
    }

    return NextResponse.json(plan);
}
