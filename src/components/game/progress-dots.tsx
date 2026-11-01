import { cn } from "@/lib/utils";

type ProgressDotsProps = {
    total: number;
    position: number;
    results: boolean[];
};

const getDotState = (index: number, position: number, results: boolean[]) => {
    if (index < results.length) {
        return results[index] ? "correct" : "wrong";
    }
    return index === position ? "current" : "upcoming";
};

const ProgressDots = ({ total, position, results }: ProgressDotsProps) => {
    return (
        <div
            role="img"
            aria-label={`Post ${position + 1} of ${total}`}
            className="flex gap-1.5"
        >
            {Array.from({ length: total }, (_, index) => {
                const state = getDotState(index, position, results);
                return (
                    <span
                        key={index}
                        data-state={state}
                        className={cn(
                            "size-2 rounded-full sm:size-2.5",
                            state === "correct" && "bg-correct",
                            state === "wrong" && "bg-wrong",
                            state === "current" && "bg-foreground",
                            state === "upcoming" && "bg-muted"
                        )}
                    />
                );
            })}
        </div>
    );
};

export default ProgressDots;
