import TimelineItem from "./TimelineItem";
import {DayPlan} from "@/app/api/plan/types";

type Props = {
    day: DayPlan;
};

export default function TimelineDay({ day }: Props) {
    return (
        <div className="relative rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
            <h3 className="text-lg font-semibold tracking-tight">
                {day.date}
            </h3>

            <div className="mt-4 grid gap-4">
                {day.items.map((it, idx) => (
                    <TimelineItem
                        key={idx}
                        item={it}
                        isLast={idx === day.items.length - 1}
                    />
                ))}
            </div>
        </div>
    );
}
