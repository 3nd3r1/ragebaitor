import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { posts } from "@/lib/posts";

describe("posts", () => {
    it("loads and validates posts.json", () => {
        expect(posts.length).toBeGreaterThan(0);
    });

    it("has both labels", () => {
        const labels = new Set(posts.map((post) => post.label));
        expect(labels).toEqual(new Set(["bait", "genuine"]));
    });

    it("references images that exist in public/", () => {
        const urls = posts.flatMap((post) =>
            [post.content, ...(post.proof ?? [])].flatMap((content) =>
                content.media.map((media) => media.url)
            )
        );
        for (const url of urls) {
            expect(existsSync(path.join("public", url)), url).toBe(true);
        }
    });
});
