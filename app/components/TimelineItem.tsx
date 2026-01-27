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

type Props = {
    item: TimelineItemType;
    isLast: boolean;
};

export default function TimelineItem({ item, isLast }: Props) {
    return (
        <div className="flex gap-4">
            <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg">
                    {iconFor(item.type)}
                </div>
                {!isLast && (
                    <div className="w-px flex-1 bg-slate-200 mt-1" />
                )}
            </div>

            <div className="flex-1 pb-2">
                <div className="text-sm text-slate-500">
                    {item.time}
                </div>
                <div className="font-medium">
                    {item.title}
                </div>
                <div className="text-sm text-slate-700 mt-0.5">
                    {item.description}
                </div>
                {item.location && (
                    <div className="text-sm text-slate-500 mt-1">
                        📍 {item.location}
                    </div>
                )}
            </div>
        </div>
    );
}
