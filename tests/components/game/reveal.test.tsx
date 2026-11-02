import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { Post } from "@/validators/post";

import Reveal from "@/components/game/reveal";

const post: Post = {
    id: "p001",
    label: "bait",
    content: { handle: "@quietlemon42", text: "A post", media: [] },
    reason: "Posts the same take every week.",
};

describe("Reveal", () => {
    it("shows a correct guess with the reason", () => {
        render(
            <Reveal post={post} guess="bait" isLast={false} onNext={vi.fn()} />
        );
        expect(screen.getByText("Correct.")).toBeInTheDocument();
        expect(screen.getByText(/It was bait/)).toBeInTheDocument();
        expect(screen.getByText(post.reason)).toBeInTheDocument();
    });

    it("shows a wrong guess", () => {
        render(
            <Reveal
                post={post}
                guess="genuine"
                isLast={false}
                onNext={vi.fn()}
            />
        );
        expect(screen.getByText("Wrong.")).toBeInTheDocument();
    });

    it("hides source and proof links when there are none", () => {
        render(
            <Reveal post={post} guess="bait" isLast={false} onNext={vi.fn()} />
        );
        expect(screen.queryByText("View original")).not.toBeInTheDocument();
        expect(screen.queryByText("Show proof")).not.toBeInTheDocument();
    });

    it("links to the original and shows proof", () => {
        render(
            <Reveal
                post={{
                    ...post,
                    sourceUrl: "https://example.com/post",
                    proof: [{ text: "lol this one did numbers", media: [] }],
                }}
                guess="bait"
                isLast={false}
                onNext={vi.fn()}
            />
        );
        expect(
            screen.getByRole("link", { name: "View original" })
        ).toHaveAttribute("href", "https://example.com/post");

        fireEvent.click(screen.getByRole("button", { name: "Show proof" }));
        expect(
            screen.getByText("lol this one did numbers")
        ).toBeInTheDocument();
    });

    it("calls onNext and says See results on the last post", () => {
        const onNext = vi.fn();
        render(<Reveal post={post} guess="bait" isLast onNext={onNext} />);
        fireEvent.click(screen.getByRole("button", { name: "See results" }));
        expect(onNext).toHaveBeenCalledOnce();
    });
});
