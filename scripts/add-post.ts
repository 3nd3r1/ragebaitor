import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import sharp from "sharp";

import {
    type Content,
    type Media,
    type Post,
    postSchema,
    postsSchema,
} from "@/validators/post";

import { makeHandle } from "./lib/handle";
import {
    fetchTweet,
    getTweetPhotoUrls,
    getTweetText,
    parseTweetId,
} from "./lib/x";

const POSTS_JSON = path.join(process.cwd(), "src/data/posts.json");
const POSTS_DIR = path.join(process.cwd(), "public/posts");
const WIDTH = 1080;

const USAGE = `Usage:
  npm run add-post -- <x-link|image> --label bait|genuine --reason "..." [--proof <x-link|image>]...

  Images also need --alt "the post's text". Use --no-source to hide the "View original" link.`;

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

// Real usernames map to one fake handle per run, so a post and its proof by
// the same person share a handle.
const handles = new Map<string, string>();

const importContent = async (
    input: string,
    name: string,
    alt?: string
): Promise<Content> => {
    const tweetId = parseTweetId(input);
    if (!tweetId) {
        if (!alt) throw new Error("Images need --alt");
        return { media: [await importImage(input, `${name}-1`, alt)] };
    }

    const tweet = await fetchTweet(tweetId);
    const author = tweet.user.screen_name.toLowerCase();
    const handle = handles.get(author) ?? makeHandle();
    handles.set(author, handle);

    const media = await Promise.all(
        getTweetPhotoUrls(tweet).map(async (url, i) =>
            importImage(await download(url), `${name}-${i + 1}`)
        )
    );
    return { handle, text: getTweetText(tweet) || undefined, media };
};

const main = async () => {
    const { values, positionals } = parseArgs({
        allowPositionals: true,
        options: {
            label: { type: "string" },
            reason: { type: "string" },
            alt: { type: "string" },
            source: { type: "string" },
            "no-source": { type: "boolean" },
            proof: { type: "string", multiple: true },
        },
    });

    const [input] = positionals;
    if (!input || !values.label || !values.reason) {
        console.error(USAGE);
        process.exit(1);
    }

    await mkdir(POSTS_DIR, { recursive: true });
    await mkdir(path.dirname(POSTS_JSON), { recursive: true });

    const posts = await readPosts();
    const id = nextId(posts);
    const isLink = parseTweetId(input) !== null;

    const draft = postSchema.omit({ content: true, proof: true }).parse({
        id,
        label: values.label,
        reason: values.reason,
        sourceUrl: values["no-source"]
            ? undefined
            : (values.source ?? (isLink ? input : undefined)),
    });

    const content = await importContent(input, id, values.alt);
    const proofInputs = values.proof ?? [];
    const proof: Content[] = [];
    for (const [i, proofInput] of proofInputs.entries()) {
        proof.push(
            await importContent(proofInput, `${id}-proof-${i + 1}`, "Proof")
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
    console.log(
        `Added ${id} (${post.label}) as ${post.content.handle ?? "image"}`
    );
    if (post.content.text) console.log(`  "${post.content.text}"`);
};

main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});
