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
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col gap-8 lg:justify-center">
            <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center lg:flex-none">
                <p className="text-muted-foreground">#{dayNumber}</p>
                <p className="font-heading text-8xl font-extrabold tracking-tight">
                    {score}/{results.length}
                </p>
                <p className="text-xl whitespace-nowrap sm:text-2xl">
                    {formatResultGrid(results)}
                </p>
                <dl className="grid w-full grid-cols-2 gap-3">
                    <div className="rounded-xl bg-card p-4">
                        <dd className="font-heading text-3xl font-bold">
                            {streak}
                        </dd>
                        <dt className="text-sm text-muted-foreground">
                            Streak
                        </dt>
                    </div>
                    <div className="rounded-xl bg-card p-4">
                        <dd className="font-heading text-3xl font-bold">
                            {maxStreak}
                        </dd>
                        <dt className="text-sm text-muted-foreground">Best</dt>
                    </div>
                </dl>
                <p className="text-muted-foreground">New posts tomorrow.</p>
            </div>
            <Button
                className="h-16 rounded-xl font-heading text-lg font-bold"
                onClick={copyShareText}
            >
                Copy result
            </Button>
        </div>
    );
};

export default EndScreen;
