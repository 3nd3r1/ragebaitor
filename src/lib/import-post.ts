import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

import {
    type Content,
    type Label,
    type Media,
    type Post,
    postSchema,
    postsSchema,
} from "@/validators/post";

import { makeHandle } from "@/lib/handle";
import {
    fetchTweet,
    getTweetPhotoUrls,
    getTweetText,
    parseTweetId,
} from "@/lib/x";

const POSTS_JSON = path.join(process.cwd(), "src/data/posts.json");
const POSTS_DIR = path.join(process.cwd(), "public/posts");
const WIDTH = 1080;

export type ImportOptions = {
    input: string;
    label: Label;
    reason: string;
    alt?: string;
    source?: string;
    noSource?: boolean;
    noMedia?: boolean;
    proof?: string[];
};

const readPosts = async (): Promise<Post[]> => {
    try {
        return postsSchema.parse(
            JSON.parse(await readFile(POSTS_JSON, "utf8"))
        );
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
        throw error;
    }
};

const nextId = (posts: Post[]): string => {
    const max = Math.max(0, ...posts.map((post) => Number(post.id.slice(1))));
    return `p${String(max + 1).padStart(3, "0")}`;
};

// sharp strips metadata (EXIF, location) by default.
const importImage = async (
    input: string | Buffer,
    name: string,
    alt?: string
): Promise<Media> => {
    const { width, height } = await sharp(input)
        .rotate()
        .resize({ width: WIDTH, withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(path.join(POSTS_DIR, `${name}.webp`));
    return { type: "image", url: `/posts/${name}.webp`, width, height, alt };
};

const download = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Couldn't download ${url}`);
    return Buffer.from(await response.arrayBuffer());
};

const importContent = async (
    input: string,
    name: string,
    handles: Map<string, string>,
    alt?: string,
    noMedia = false
): Promise<Content> => {
    const tweetId = parseTweetId(input);
    if (!tweetId) {
        if (!alt) throw new Error("Images need alt text");
        return { media: [await importImage(input, `${name}-1`, alt)] };
    }

    const tweet = await fetchTweet(tweetId);
    const author = tweet.user.screen_name.toLowerCase();
    const handle = handles.get(author) ?? makeHandle();
    handles.set(author, handle);

    const photoUrls = noMedia ? [] : getTweetPhotoUrls(tweet);
    const media = await Promise.all(
        photoUrls.map(async (url, i) =>
            importImage(await download(url), `${name}-${i + 1}`)
        )
    );
    return { handle, text: getTweetText(tweet) || undefined, media };
};

export const importPost = async (options: ImportOptions): Promise<Post> => {
    await mkdir(POSTS_DIR, { recursive: true });
    await mkdir(path.dirname(POSTS_JSON), { recursive: true });

    const posts = await readPosts();
    const id = nextId(posts);
    const isLink = parseTweetId(options.input) !== null;

    const draft = postSchema.omit({ content: true, proof: true }).parse({
        id,
        label: options.label,
        reason: options.reason,
        sourceUrl: options.noSource
            ? undefined
            : (options.source ?? (isLink ? options.input : undefined)),
    });

    // Real usernames map to one fake handle per import, so a post and its
    // proof by the same person share a handle.
    const handles = new Map<string, string>();
    const content = await importContent(
        options.input,
        id,
        handles,
        options.alt,
        options.noMedia
    );
    const proof: Content[] = [];
    for (const [i, proofInput] of (options.proof ?? []).entries()) {
        proof.push(
            await importContent(
                proofInput,
                `${id}-proof-${i + 1}`,
                handles,
                "Proof"
            )
        );
    }

    const post = postSchema.parse({
        ...draft,
        content,
        proof: proof.length > 0 ? proof : undefined,
    });
    await writeFile(
        POSTS_JSON,
        `${JSON.stringify([...posts, post], null, 4)}\n`
    );
    return post;
};
