import { cn } from "@/lib/utils";

interface RiskBadgeProps {
    score: number;
    status: string;
}

export function RiskBadge({ score, status }: RiskBadgeProps) {
    let colorClass = "bg-green-100 text-green-700 border-green-200";

    if (score >= 90) {
        colorClass = "bg-red-100 text-red-700 border-red-200 animate-pulse";
    } else if (score >= 70) {
        colorClass = "bg-amber-100 text-amber-700 border-amber-200";
    } else if (score >= 40) {
        colorClass = "bg-yellow-100 text-yellow-700 border-yellow-200";
    }

    return (
        <div className={cn("flex px-3 py-1 rounded-full border text-xs font-semibold items-center gap-2", colorClass)}>
            <div className={cn("w-2 h-2 rounded-full bg-current")} />
            <span>{status} ({score})</span>
        </div>
    );
}
