import type { TimelineItem as TimelineItemType } from "@/app/api/plan/types";

export function iconFor(type: TimelineItemType["type"]) {
    switch (type) {
        case "transport":
            return "🚆";
        case "sightseeing":
            return "🏛️";
        case "food":
            return "🍽️";
        case "free-time":
            return "🕰️";
        case "evening":
            return "🎶";
        case "hotel":
            return "🏨";
        default:
            return "📌";
    }
}
