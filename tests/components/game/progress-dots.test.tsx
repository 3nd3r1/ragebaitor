import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ProgressDots from "@/components/game/progress-dots";

const getStates = () =>
    Array.from(screen.getByRole("img").children).map((dot) =>
        dot.getAttribute("data-state")
    );

describe("ProgressDots", () => {
    it("shows correct, wrong, current and upcoming posts", () => {
        render(<ProgressDots total={4} position={2} results={[true, false]} />);
        expect(getStates()).toEqual([
            "correct",
            "wrong",
            "current",
            "upcoming",
        ]);
    });

    it("shows the result on the current post during a reveal", () => {
        render(<ProgressDots total={2} position={0} results={[false]} />);
        expect(getStates()).toEqual(["wrong", "upcoming"]);
    });

    it("describes progress for screen readers", () => {
        render(<ProgressDots total={10} position={2} results={[true, true]} />);
        expect(screen.getByRole("img")).toHaveAccessibleName("Post 3 of 10");
    });
});
