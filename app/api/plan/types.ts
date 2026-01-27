export type TimelineItemType =
    | "transport"
    | "sightseeing"
    | "food"
    | "free-time"
    | "evening"
    | "hotel"
    | "other";

export type TimelineItem = {
    time: string;       // "08:00 - 11:00"
    title: string;      // "Train: Belgrade → Vienna"
    description: string;
    type: TimelineItemType;
    location?: string;  // optional, helpful for UX
};

export type DayPlan = {
    date: string; // "2026-04-12"
    items: TimelineItem[];
};

export type TravelPlanResponse = {
    destination: string;
    currency: string;
    days: DayPlan[];
};

export type TravelPlanRequest = {
    from: string;
    to: string;
    startDate: string; // YYYY-MM-DD
    days: number;
    budget: "low" | "medium" | "high";
    style: "relaxed" | "balanced" | "packed";
    interests: string[];
    notes?: string; // extra constraints
};
