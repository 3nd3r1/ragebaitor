import { toast } from "sonner";

import { formatResultGrid, formatShareText } from "@/lib/share";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
                <p className="text-label text-muted-foreground">#{dayNumber}</p>
                <p className="font-heading text-8xl">
                    {score}/{results.length}
                </p>
                <p className="text-xl whitespace-nowrap sm:text-2xl">
                    {formatResultGrid(results)}
                </p>
                <dl className="grid w-full grid-cols-2 gap-3">
                    <Card size="sm" className="gap-1">
                        <dd className="font-heading text-4xl">{streak}</dd>
                        <dt className="text-label text-muted-foreground">
                            Streak
                        </dt>
                    </Card>
                    <Card size="sm" className="gap-1">
                        <dd className="font-heading text-4xl">{maxStreak}</dd>
                        <dt className="text-label text-muted-foreground">
                            Best
                        </dt>
                    </Card>
                </dl>
                <p className="text-muted-foreground">New posts tomorrow.</p>
            </div>
            <Button size="xl" onClick={copyShareText}>
                Copy result
            </Button>
        </div>
    );
};

export default EndScreen;
