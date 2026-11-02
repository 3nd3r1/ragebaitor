import { describe, expect, it } from "vitest";

import type { Label, Post } from "@/validators/post";

import {
    LAUNCH_DATE,
    addDays,
    getDailyPosts,
    getDayNumber,
    toDateKey,
} from "@/lib/daily";

const makePosts = (count: number, label: Label, offset = 0): Post[] =>
    Array.from({ length: count }, (_, i) => {
        const id = `p${String(offset + i + 1).padStart(3, "0")}`;
        return {
            id,
            label,
            content: { text: id, media: [] },
            reason: id,
        };
    });

const pool = [...makePosts(20, "bait"), ...makePosts(20, "genuine", 20)];
const ids = (posts: Post[]) => posts.map((post) => post.id);

describe("toDateKey", () => {
    it("uses the local calendar date", () => {
        expect(toDateKey(new Date(2026, 9, 29, 23, 59))).toBe("2026-10-29");
        expect(toDateKey(new Date(2026, 0, 5, 0, 0))).toBe("2026-01-05");
    });
});

describe("addDays", () => {
    it("crosses month and year boundaries", () => {
        expect(addDays("2026-10-31", 1)).toBe("2026-11-01");
        expect(addDays("2027-01-01", -1)).toBe("2026-12-31");
    });
});

describe("getDayNumber", () => {
    it("starts at 1 on launch day", () => {
        expect(getDayNumber(LAUNCH_DATE)).toBe(1);
        expect(getDayNumber(addDays(LAUNCH_DATE, 1))).toBe(2);
    });

    it("counts days across DST changes", () => {
        expect(getDayNumber("2027-03-29") - getDayNumber("2027-03-27")).toBe(2);
    });
});

describe("getDailyPosts", () => {
    it("gives the same set for the same date", () => {
        expect(ids(getDailyPosts(pool, "2026-11-03"))).toEqual(
            ids(getDailyPosts(pool, "2026-11-03"))
        );
    });

    it("picks 5 bait and 5 genuine", () => {
        const round = getDailyPosts(pool, "2026-11-03");
        expect(round).toHaveLength(10);
        expect(round.filter((post) => post.label === "bait")).toHaveLength(5);
    });

    it("doesn't repeat posts until the pool runs out", () => {
        const seen = new Set<string>();
        for (let day = 0; day < 4; day++) {
            for (const post of getDailyPosts(pool, addDays(LAUNCH_DATE, day))) {
                expect(seen.has(post.id), post.id).toBe(false);
                seen.add(post.id);
            }
        }
        expect(seen.size).toBe(40);
    });

    it("cycles back once the pool runs out", () => {
        const day1 = getDailyPosts(pool, LAUNCH_DATE);
        const day5 = getDailyPosts(pool, addDays(LAUNCH_DATE, 4));
        expect(new Set(ids(day5))).toEqual(new Set(ids(day1)));
    });

    it("keeps upcoming days when new posts are added", () => {
        const bigger = [...pool, ...makePosts(5, "bait", 40)];
        expect(ids(getDailyPosts(bigger, LAUNCH_DATE))).toEqual(
            ids(getDailyPosts(pool, LAUNCH_DATE))
        );
    });

    it("uses every post when the pool is smaller than a round", () => {
        const small = [...makePosts(2, "bait"), ...makePosts(2, "genuine", 2)];
        expect(new Set(ids(getDailyPosts(small, "2026-11-03")))).toEqual(
            new Set(ids(small))
        );
    });
});
