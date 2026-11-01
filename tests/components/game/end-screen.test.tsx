import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";

import EndScreen from "@/components/game/end-screen";

vi.mock("sonner", () => ({
    toast: { success: vi.fn(), error: vi.fn() },
}));

const writeText = vi.fn();

const renderEndScreen = () =>
    render(
        <EndScreen
            dayNumber={3}
            results={[true, false, true]}
            streak={2}
            maxStreak={5}
        />
    );

beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText },
    });
});

describe("EndScreen", () => {
    it("shows score, grid and streak", () => {
        renderEndScreen();
        expect(screen.getByText("#3")).toBeInTheDocument();
        expect(screen.getByText("2/3")).toBeInTheDocument();
        expect(screen.getByText("⬜🎣⬜")).toBeInTheDocument();
        expect(screen.getByText("Streak").previousSibling).toHaveTextContent(
            "2"
        );
        expect(screen.getByText("Best").previousSibling).toHaveTextContent("5");
    });

    it("copies the share text", async () => {
        writeText.mockResolvedValue(undefined);
        renderEndScreen();
        fireEvent.click(screen.getByRole("button", { name: "Copy result" }));

        await waitFor(() =>
            expect(toast.success).toHaveBeenCalledWith("Copied")
        );
        expect(writeText).toHaveBeenCalledWith(
            "Ragebaitor #3 2/3\n⬜🎣⬜\nragebaitor.com"
        );
    });

    it("says so when copying fails", async () => {
        writeText.mockRejectedValue(new Error("blocked"));
        renderEndScreen();
        fireEvent.click(screen.getByRole("button", { name: "Copy result" }));

        await waitFor(() =>
            expect(toast.error).toHaveBeenCalledWith("Couldn't copy")
        );
    });
});
