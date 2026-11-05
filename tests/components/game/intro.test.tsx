import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import Intro from "@/components/game/intro";

const QUESTION = "Most of the internet is ragebait. Can you spot it?";

describe("Intro", () => {
    beforeEach(() => window.localStorage.clear());

    it("opens on the first visit and stays closed after", () => {
        const { unmount } = render(<Intro />);
        expect(screen.getByText(QUESTION)).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "Play" }));
        unmount();

        render(<Intro />);
        expect(screen.queryByText(QUESTION)).not.toBeInTheDocument();
    });

    it("opens from the help button", () => {
        window.localStorage.setItem("ragebaitor:intro-seen", "1");
        render(<Intro />);

        fireEvent.click(screen.getByRole("button", { name: "How to play" }));
        expect(screen.getByText(QUESTION)).toBeInTheDocument();
    });
});
