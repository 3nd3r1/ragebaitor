import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { STORAGE_KEY } from "@/lib/storage";

import { useDailyGame } from "@/hooks/use-daily-game";

vi.mock("@/lib/posts", () => ({
    posts: Array.from({ length: 10 }, (_, i) => {
        const id = `p${String(i + 1).padStart(3, "0")}`;
        return {
            id,
            label: i < 5 ? "bait" : "genuine",
            content: { text: id, media: [] },
            reason: id,
        };
    }),
}));

const setDay = (day: number) =>
    vi.setSystemTime(new Date(2026, 10, day, 12, 0));

type Game = ReturnType<typeof useDailyGame>;

const ready = (game: Game) => {
    if (!game.ready) throw new Error("game not ready");
    return game;
};

const playRound = (result: { current: Game }, correct = true) => {
    const total = ready(result.current).round.length;
    for (let i = 0; i < total; i++) {
        const post = ready(result.current).current!;
        const wrong = post.label === "bait" ? "genuine" : "bait";
        act(() => ready(result.current).guess(correct ? post.label : wrong));
        act(() => ready(result.current).next());
    }
};

beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ toFake: ["Date"] });
    setDay(3);
});

afterEach(() => {
    vi.useRealTimers();
});

describe("useDailyGame", () => {
    it("starts on the first post", () => {
        const game = ready(renderHook(() => useDailyGame()).result.current);
        expect(game.round).toHaveLength(10);
        expect(game.position).toBe(0);
        expect(game.revealed).toBe(false);
        expect(game.finished).toBe(false);
    });

    it("reveals after a guess and moves on with next", () => {
        const { result } = renderHook(() => useDailyGame());
        const first = ready(result.current).current!;

        act(() => ready(result.current).guess(first.label));
        expect(ready(result.current).revealed).toBe(true);
        expect(ready(result.current).results).toEqual([true]);

        act(() => ready(result.current).next());
        expect(ready(result.current).position).toBe(1);
        expect(ready(result.current).revealed).toBe(false);
    });

    it("ignores a second guess on the same post and next before guessing", () => {
        const { result } = renderHook(() => useDailyGame());

        act(() => ready(result.current).next());
        expect(ready(result.current).position).toBe(0);

        act(() => ready(result.current).guess("bait"));
        act(() => ready(result.current).guess("genuine"));
        expect(ready(result.current).guesses).toEqual(["bait"]);
    });

    it("finishes the round and starts a streak", () => {
        const { result } = renderHook(() => useDailyGame());
        playRound(result);

        const game = ready(result.current);
        expect(game.finished).toBe(true);
        expect(game.results).toEqual(Array(10).fill(true));
        expect(game.streak).toBe(1);
    });

    it("resumes where the player left off", () => {
        const first = renderHook(() => useDailyGame());
        act(() => ready(first.result.current).guess("bait"));
        first.unmount();

        const game = ready(renderHook(() => useDailyGame()).result.current);
        expect(game.guesses).toEqual(["bait"]);
        expect(game.revealed).toBe(true);
    });

    it("grows the streak on consecutive days", () => {
        const { result, rerender } = renderHook(() => useDailyGame());
        playRound(result);

        setDay(4);
        rerender();
        expect(ready(result.current).finished).toBe(false);
        playRound(result, false);
        expect(ready(result.current).streak).toBe(2);
        expect(ready(result.current).maxStreak).toBe(2);
    });

    it("resets the streak after a missed day", () => {
        const { result, rerender } = renderHook(() => useDailyGame());
        playRound(result);

        setDay(6);
        rerender();
        expect(ready(result.current).streak).toBe(0);
        playRound(result);
        expect(ready(result.current).streak).toBe(1);
        expect(ready(result.current).maxStreak).toBe(1);
    });

    it("starts fresh when saved data is corrupt", () => {
        localStorage.setItem(STORAGE_KEY, "{not json");
        const game = ready(renderHook(() => useDailyGame()).result.current);
        expect(game.position).toBe(0);
    });
});
