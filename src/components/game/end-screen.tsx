import { toast } from "sonner";

import { formatResultGrid, formatShareText } from "@/lib/share";

import { Button } from "@/components/ui/button";

type EndScreenProps = {
    dayNumber: number;
    results: boolean[];
    streak: number;
    maxStreak: number;
};

const EndScreen = ({
    dayNumber,
    results,
    streak,
    maxStreak,
}: EndScreenProps) => {
    const score = results.filter(Boolean).length;

    const copyShareText = async () => {
        try {
            await navigator.clipboard.writeText(
                formatShareText(dayNumber, results)
            );
            toast.success("Copied");
        } catch {
            toast.error("Couldn't copy");
        }
    };

    return (
        <div className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                <p className="text-muted-foreground">Ragebaitor #{dayNumber}</p>
                <p className="text-6xl font-bold">
                    {score}/{results.length}
                </p>
                <p className="text-xl">{formatResultGrid(results)}</p>
                <p className="text-muted-foreground">
                    Streak {streak} · Best {maxStreak}
                </p>
                <p className="text-muted-foreground">New posts tomorrow.</p>
            </div>
            <Button className="h-14 text-base" onClick={copyShareText}>
                Copy result
            </Button>
        </div>
    );
};

export default EndScreen;
