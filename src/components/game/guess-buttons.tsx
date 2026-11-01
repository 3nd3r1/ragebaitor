import type { Label } from "@/validators/post";

import { Button } from "@/components/ui/button";

const GuessButtons = ({ onGuess }: { onGuess: (label: Label) => void }) => {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-center font-heading text-2xl font-bold lg:text-left lg:text-4xl">
                Bait or genuine?
            </h1>
            <div className="grid grid-cols-2 gap-3">
                <Button
                    className="h-16 rounded-xl bg-bait font-heading text-lg font-bold text-bait-foreground hover:bg-bait/85"
                    onClick={() => onGuess("bait")}
                >
                    Bait
                </Button>
                <Button
                    className="h-16 rounded-xl font-heading text-lg font-bold"
                    onClick={() => onGuess("genuine")}
                >
                    Genuine
                </Button>
            </div>
        </div>
    );
};

export default GuessButtons;
