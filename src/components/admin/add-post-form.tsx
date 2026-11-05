"use client";

import { type FormEvent, useRef, useState, useTransition } from "react";

import { toast } from "sonner";

import type { Post, Label as PostLabel } from "@/validators/post";

import { parseTweetId } from "@/lib/x";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import PostContent from "@/components/game/post-content";

import { type TweetPreview, addPost, previewTweet } from "@/app/add/actions";

const AddPostForm = () => {
    const [link, setLink] = useState("");
    const [reason, setReason] = useState("");
    const [proof, setProof] = useState("");
    const [noSource, setNoSource] = useState(false);
    const [noMedia, setNoMedia] = useState(false);
    const [preview, setPreview] = useState<TweetPreview | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [added, setAdded] = useState<Post | null>(null);
    const [pending, startTransition] = useTransition();
    const latestLink = useRef("");
    const linkInput = useRef<HTMLInputElement>(null);

    const onLinkChange = (value: string) => {
        setLink(value);
        setPreview(null);
        setError(null);
        latestLink.current = value;
        if (!parseTweetId(value.trim())) return;
        previewTweet(value).then((result) => {
            if (latestLink.current !== value) return;
            setPreview(result);
            if (result.ok && result.hasVideo) setNoMedia(true);
        });
    };

    const submit = (label: PostLabel) => {
        setError(null);
        startTransition(async () => {
            const result = await addPost({
                link,
                label,
                reason,
                proof,
                noSource,
                noMedia,
            });
            if (!result.ok) {
                setError(result.error);
                return;
            }
            setAdded(result.post);
            toast.success(`Added ${result.post.id} as ${label}`);
            onLinkChange("");
            setReason("");
            setProof("");
            setNoSource(false);
            setNoMedia(false);
            linkInput.current?.focus();
        });
    };

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const submitter = (event.nativeEvent as SubmitEvent)
            .submitter as HTMLButtonElement | null;
        if (submitter?.value === "bait" || submitter?.value === "genuine") {
            submit(submitter.value);
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <form onSubmit={onSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="link">Link</Label>
                    <Input
                        id="link"
                        ref={linkInput}
                        value={link}
                        onChange={(event) => onLinkChange(event.target.value)}
                        placeholder="https://x.com/someone/status/123"
                        autoComplete="off"
                        autoFocus
                    />
                </div>

                {preview &&
                    (preview.ok ? (
                        <div className="flex flex-col gap-2">
                            <PostContent
                                content={{ text: preview.text, media: [] }}
                            />
                            {(preview.photos > 0 || preview.hasVideo) && (
                                <p className="text-sm text-muted-foreground">
                                    {preview.hasVideo
                                        ? "Has a video, so only the text is imported."
                                        : `${preview.photos} photo${preview.photos > 1 ? "s" : ""}`}
                                </p>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-destructive">
                            {preview.error}
                        </p>
                    ))}

                <div className="flex flex-col gap-2">
                    <Label htmlFor="reason">Reason</Label>
                    <Textarea
                        id="reason"
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        placeholder="One line on why it's bait or genuine"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="proof">Proof links</Label>
                    <Textarea
                        id="proof"
                        value={proof}
                        onChange={(event) => setProof(event.target.value)}
                        placeholder="Optional, one per line"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <Label>
                        <Checkbox
                            checked={noSource}
                            onCheckedChange={setNoSource}
                        />
                        Hide link to original
                    </Label>
                    <Label>
                        <Checkbox
                            checked={noMedia}
                            onCheckedChange={setNoMedia}
                        />
                        Text only
                    </Label>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <div className="grid grid-cols-2 gap-3">
                    <Button
                        type="submit"
                        value="bait"
                        variant="bait"
                        size="xl"
                        disabled={pending}
                    >
                        Add as bait
                    </Button>
                    <Button
                        type="submit"
                        value="genuine"
                        variant="outline"
                        size="xl"
                        disabled={pending}
                    >
                        Add as genuine
                    </Button>
                </div>
            </form>

            {added && (
                <div className="flex flex-col gap-2">
                    <p className="text-label text-muted-foreground">
                        Last added: {added.id}, {added.label}
                    </p>
                    <PostContent content={added.content} />
                    <p className="text-sm text-muted-foreground">
                        {added.reason}
                    </p>
                </div>
            )}
        </div>
    );
};

export default AddPostForm;
