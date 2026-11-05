import { parseArgs } from "node:util";

import { labelSchema } from "@/validators/post";

import { importPost } from "@/lib/import-post";

const USAGE = `Usage:
  npm run add-post -- <x-link|image> --label bait|genuine --reason "..." [--proof <x-link|image>]...

  Images also need --alt "the post's text". Use --no-source to hide the "View original" link.
  Use --no-media to import only a link's text, skipping its photos or video.`;

const main = async () => {
    const { values, positionals } = parseArgs({
        allowPositionals: true,
        options: {
            label: { type: "string" },
            reason: { type: "string" },
            alt: { type: "string" },
            source: { type: "string" },
            "no-source": { type: "boolean" },
            "no-media": { type: "boolean" },
            proof: { type: "string", multiple: true },
        },
    });

    const [input] = positionals;
    if (!input || !values.label || !values.reason) {
        console.error(USAGE);
        process.exit(1);
    }

    const post = await importPost({
        input,
        label: labelSchema.parse(values.label),
        reason: values.reason,
        alt: values.alt,
        source: values.source,
        noSource: values["no-source"],
        noMedia: values["no-media"],
        proof: values.proof,
    });
    console.log(
        `Added ${post.id} (${post.label}) as ${post.content.handle ?? "image"}`
    );
    if (post.content.text) console.log(`  "${post.content.text}"`);
};

main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});
