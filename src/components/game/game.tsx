"use client";

import { useDailyGame } from "@/hooks/use-daily-game";

import EndScreen from "@/components/game/end-screen";
import GuessButtons from "@/components/game/guess-buttons";
import PostCard from "@/components/game/post-card";
import ProgressDots from "@/components/game/progress-dots";
import Reveal from "@/components/game/reveal";

const Game = () => {
    const game = useDailyGame();

    if (!game.ready) {
        return null;
    }

    const playing = !game.finished && game.current;

    return (
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:max-w-5xl lg:gap-8 lg:p-8">
            <header className="flex items-center justify-between">
                <span className="font-heading text-xl font-semibold tracking-wider uppercase lg:text-2xl">
                    Ragebaitor
                </span>
                {playing && (
                    <ProgressDots
                        total={game.round.length}
                        position={game.position}
                        results={game.results}
                    />
                )}
            </header>
            {game.current && playing ? (
                <div className="flex flex-1 flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-center lg:gap-12">
                    <PostCard key={game.current.id} post={game.current} />
                    {game.revealed ? (
                        <Reveal
                            post={game.current}
                            guess={game.guesses[game.position]}
                            isLast={game.position === game.round.length - 1}
                            onNext={game.next}
                        />
                    ) : (
                        <GuessButtons onGuess={game.guess} />
                    )}
                </div>
            ) : (
                <EndScreen
                    dayNumber={game.dayNumber}
                    results={game.results}
                    streak={game.streak}
                    maxStreak={game.maxStreak}
                />
            )}
        </div>
    );
};

export default Game;
