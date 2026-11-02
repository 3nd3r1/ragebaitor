import {
    getTweetPhotoUrls,
    getTweetText,
    parseTweetId,
} from "../../scripts/lib/x";

import { describe, expect, it } from "vitest";

import type { Tweet } from "@/validators/tweet";

const tweet = (overrides: Partial<Tweet>): Tweet => ({
    text: "",
    display_text_range: [0, 0],
    user: { screen_name: "someone" },
    ...overrides,
});

describe("parseTweetId", () => {
    it("reads x.com and twitter.com links", () => {
        expect(parseTweetId("https://x.com/a_b/status/123?s=20")).toBe("123");
        expect(parseTweetId("https://twitter.com/ab/status/456/photo/1")).toBe(
            "456"
        );
        expect(parseTweetId("https://mobile.x.com/ab/status/789")).toBe("789");
    });

    it("rejects anything else", () => {
        expect(parseTweetId("./shot.png")).toBeNull();
        expect(parseTweetId("https://x.com/ab")).toBeNull();
    });
});

describe("getTweetText", () => {
    it("drops the trailing media link", () => {
        const text =
            "It’s Saturday, meaning you can eat candy today https://t.co/9Q71eOqVYk";
        expect(getTweetText(tweet({ text, display_text_range: [0, 46] }))).toBe(
            "It’s Saturday, meaning you can eat candy today"
        );
    });

    it("drops reply mentions and counts emoji as one character", () => {
        const text = "@someone 🍕 is great";
        expect(getTweetText(tweet({ text, display_text_range: [9, 19] }))).toBe(
            "🍕 is great"
        );
    });

    it("expands links and decodes HTML entities", () => {
        const text = "Tom &amp; Jerry &gt; all https://t.co/abc";
        expect(
            getTweetText(
                tweet({
                    text,
                    display_text_range: [0, 41],
                    entities: {
                        urls: [
                            {
                                url: "https://t.co/abc",
                                display_url: "example.com/x",
                            },
                        ],
                    },
                })
            )
        ).toBe("Tom & Jerry > all example.com/x");
    });
});

describe("getTweetPhotoUrls", () => {
    it("asks for large photos", () => {
        expect(
            getTweetPhotoUrls(
                tweet({
                    mediaDetails: [
                        {
                            type: "photo",
                            media_url_https: "https://pbs.twimg.com/a.jpg",
                        },
                    ],
                })
            )
        ).toEqual(["https://pbs.twimg.com/a.jpg?name=large"]);
    });

    it("refuses videos", () => {
        expect(() =>
            getTweetPhotoUrls(
                tweet({
                    mediaDetails: [
                        {
                            type: "video",
                            media_url_https: "https://pbs.twimg.com/v.jpg",
                        },
                    ],
                })
            )
        ).toThrow("Videos");
    });
});
