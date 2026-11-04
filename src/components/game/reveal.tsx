import type { Label, Post } from "@/validators/post";

import { cn } from "@/lib/utils";

import { Button, buttonVariants } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import PostContent from "@/components/game/post-content";

type RevealProps = {
    post: Post;
    guess: Label;
    isLast: boolean;
    onNext: () => void;
};

const Reveal = ({ post, guess, isLast, onNext }: RevealProps) => {
    const correct = guess === post.label;

    return (
        <div className="flex flex-col gap-3 motion-safe:animate-in motion-safe:duration-300 motion-safe:fade-in motion-safe:slide-in-from-bottom-2">
            <div className="space-y-1">
                <p className="font-heading text-2xl font-semibold lg:text-4xl">
                    <span className={correct ? "text-correct" : "text-wrong"}>
                        {correct ? "Correct." : "Wrong."}
                    </span>{" "}
                    It was {post.label}.
                </p>
                <p className="text-base text-muted-foreground lg:pt-2 lg:text-lg">
                    {post.reason}
                </p>
            </div>

            {(post.sourceUrl || post.proof) && (
                <div className="flex gap-4">
                    {post.sourceUrl && (
                        <a
                            href={post.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                buttonVariants({ variant: "link" }),
                                "px-0"
                            )}
                        >
                            View original
                        </a>
                    )}
                    {post.proof && (
                        <Dialog>
                            <DialogTrigger
                                render={
                                    <Button variant="link" className="px-0" />
                                }
                            >
                                Show proof
                            </DialogTrigger>
                            <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-md">
                                <DialogTitle>Proof</DialogTitle>
                                {post.proof.map((proof, i) => (
                                    <PostContent key={i} content={proof} />
                                ))}
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            )}

            <Button size="xl" onClick={onNext}>
                {isLast ? "See results" : "Next"}
            </Button>
        </div>
    );
};

export default Reveal;
