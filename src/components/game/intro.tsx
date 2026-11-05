"use client";

import { useState, useSyncExternalStore } from "react";

import { CircleHelpIcon } from "lucide-react";

import { hasSeenIntro, markIntroSeen } from "@/lib/storage";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const noopSubscribe = () => () => {};

const RULES = [
    "You get 10 real posts a day.",
    "Guess if each one is bait, posted to make people angry, or genuine, meant for real.",
    "After each guess you see the answer and why.",
    "New posts every day at midnight.",
];

const Intro = () => {
    // True on the server, so the dialog only opens after hydration.
    const seen = useSyncExternalStore(noopSubscribe, hasSeenIntro, () => true);
    const [open, setOpen] = useState<boolean | null>(null);

    const onOpenChange = (next: boolean) => {
        if (!next) markIntroSeen();
        setOpen(next);
    };

    return (
        <Dialog open={open ?? !seen} onOpenChange={onOpenChange}>
            <DialogTrigger
                render={
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="How to play"
                    />
                }
            >
                <CircleHelpIcon className="size-5" />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>How to play</DialogTitle>
                    <DialogDescription className="font-heading text-3xl leading-tight text-foreground">
                        Most of the internet is ragebait. Can you spot it?
                    </DialogDescription>
                </DialogHeader>
                <ol className="flex list-decimal flex-col gap-2 pl-5 text-base">
                    {RULES.map((rule) => (
                        <li key={rule}>{rule}</li>
                    ))}
                </ol>
                <DialogClose render={<Button size="lg" />}>Play</DialogClose>
            </DialogContent>
        </Dialog>
    );
};

export default Intro;
