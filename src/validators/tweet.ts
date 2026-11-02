import { z } from "zod";

// The subset of X's syndication (embed) API response we use.
export const tweetSchema = z.object({
    text: z.string(),
    display_text_range: z.tuple([z.number(), z.number()]),
    user: z.object({ screen_name: z.string() }),
    entities: z
        .object({
            urls: z
                .array(z.object({ url: z.string(), display_url: z.string() }))
                .optional(),
        })
        .optional(),
    mediaDetails: z
        .array(
            z.object({
                type: z.string(),
                media_url_https: z.string(),
            })
        )
        .optional(),
});

export type Tweet = z.infer<typeof tweetSchema>;
