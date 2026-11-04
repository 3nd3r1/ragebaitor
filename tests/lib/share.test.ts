import { describe, expect, it } from "vitest";

import { formatShareText } from "@/lib/share";

describe("formatShareText", () => {
    it("shows score, grid and link", () => {
        expect(
            formatShareText(3, [false, false, true, false, true, true])
        ).toBe("Ragebaitor #3 3/6\n🎣🎣⬜🎣⬜⬜\nragebaitor.host.ender.fi");
    });

    it("handles a perfect round", () => {
        expect(formatShareText(1, Array(10).fill(true))).toBe(
            "Ragebaitor #1 10/10\n⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜\nragebaitor.host.ender.fi"
        );
    });
});
