import { loadEnvConfig } from "@next/env";
import { sql } from "drizzle-orm";
import { cp, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

import { postsSchema } from "@/validators/post";

import { getServerEnv } from "@/lib/env";

import { getDb } from "@/db";
import { posts } from "@/db/schema";

loadEnvConfig(process.cwd());

const POSTS_JSON = path.join(process.cwd(), "src/data/posts.json");
const POSTS_DIR = path.join(process.cwd(), "public/posts");

const main = async () => {
    const rows = postsSchema.parse(
        JSON.parse(await readFile(POSTS_JSON, "utf8"))
    );
    const db = getDb();

    // Re-running updates posts in place and keeps any date they were pinned to.
    await db
        .insert(posts)
        .values(rows)
        .onConflictDoUpdate({
            target: posts.id,
            set: {
                label: sql`excluded.label`,
                content: sql`excluded.content`,
                reason: sql`excluded.reason`,
                sourceUrl: sql`excluded.source_url`,
                proof: sql`excluded.proof`,
            },
        });

    const mediaDir = path.resolve(getServerEnv().MEDIA_DIR);
    await mkdir(mediaDir, { recursive: true });
    await cp(POSTS_DIR, mediaDir, { recursive: true });

    console.log(`Seeded ${rows.length} posts, copied images to ${mediaDir}`);
    await db.$client.end();
};

main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});
