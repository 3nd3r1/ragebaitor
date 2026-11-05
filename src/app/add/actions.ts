"use server";

import { z } from "zod";

import { addPostFormSchema } from "@/validators/add-post";
import type { Post } from "@/validators/post";

import { fetchTweet, getTweetText, parseTweetId } from "@/lib/x";

export type TweetPreview =
    | { ok: true; text: string; photos: number; hasVideo: boolean }
    | { ok: false; error: string };

export type AddPostResult =
    { ok: true; post: Post } | { ok: false; error: string };

// Writes to src/data and public/, which only works against the local checkout.
const isDev = () => process.env.NODE_ENV === "development";

const message = (error: unknown) =>
    error instanceof z.ZodError
        ? error.issues[0].message
        : error instanceof Error
          ? error.message
          : String(error);

export async function previewTweet(link: string): Promise<TweetPreview> {
    if (!isDev()) return { ok: false, error: "Only available in development" };
    const id = parseTweetId(link.trim());
    if (!id) return { ok: false, error: "Not an X post link" };
    try {
        const tweet = await fetchTweet(id);
        const media = tweet.mediaDetails ?? [];
        return {
            ok: true,
            text: getTweetText(tweet),
            photos: media.filter((item) => item.type === "photo").length,
            hasVideo: media.some((item) => item.type !== "photo"),
        };
    } catch (error) {
        return { ok: false, error: message(error) };
    }
}

export async function addPost(input: unknown): Promise<AddPostResult> {
    if (!isDev()) return { ok: false, error: "Only available in development" };
    try {
        const form = addPostFormSchema.parse(input);
        // Loaded lazily so sharp is never required outside development.
        const { importPost } = await import("@/lib/import-post");
        const post = await importPost({
            input: form.link,
            label: form.label,
            reason: form.reason,
            noSource: form.noSource,
            noMedia: form.noMedia,
            proof: form.proof,
        });
        return { ok: true, post };
    } catch (error) {
        return { ok: false, error: message(error) };
    }
}
