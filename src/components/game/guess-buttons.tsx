import type { Label } from "@/validators/post";

import { Button } from "@/components/ui/button";

const GuessButtons = ({ onGuess }: { onGuess: (label: Label) => void }) => {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-center font-heading text-3xl lg:text-left lg:text-5xl">
                Bait or genuine?
            </h1>
            <div className="grid grid-cols-2 gap-3">
                <Button
                    variant="bait"
                    size="xl"
                    onClick={() => onGuess("bait")}
                >
                    Bait
                </Button>
                <Button
                    variant="outline"
                    size="xl"
                    onClick={() => onGuess("genuine")}
                >
                    Genuine
                </Button>
            </div>
        </div>
    );
};

export default GuessButtons;
