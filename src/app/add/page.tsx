import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { posts } from "@/lib/posts";

import AddPostForm from "@/components/admin/add-post-form";

export const metadata: Metadata = {
    title: "Add a post",
    robots: { index: false },
};

export default function AddPage() {
    if (process.env.NODE_ENV !== "development") notFound();

    const bait = posts.filter((post) => post.label === "bait").length;

    return (
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-8 bg-background p-4 lg:p-8">
            <header className="flex items-baseline justify-between">
                <h1 className="font-heading text-3xl">Add a post</h1>
                <span className="text-label text-muted-foreground">
                    {posts.length} posts, {bait} bait
                </span>
            </header>
            <AddPostForm />
        </main>
    );
}
