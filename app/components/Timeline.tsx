import {TravelPlanResponse} from "@/app/api/plan/types";
import {iconFor} from "@/app/components/TimelineItem";

interface TimelineProps {
    plan: TravelPlanResponse;
}

const Timeline = ({plan}: TimelineProps) => {
    return (
        <section className="mt-12 grid gap-8">
            <div className="flex items-end justify-between">
                <h2 className="text-xl font-semibold">{plan.destination}</h2>
                <span className="text-sm opacity-70">Estimated Expense: {plan.estimatedExpense} {plan.currency}</span>
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
    );
}

export default Timeline;