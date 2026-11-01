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

    return (
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {game.finished || !game.current ? (
                <EndScreen
                    dayNumber={game.dayNumber}
                    results={game.results}
                    streak={game.streak}
                    maxStreak={game.maxStreak}
                />
            ) : (
                <>
                    <ProgressDots
                        total={game.round.length}
                        position={game.position}
                        results={game.results}
                    />
                    <PostCard key={game.current.id} post={game.current} />
                    <div className="mt-auto">
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
                </>
            )}
        </div>
    );
};

export default Game;
