import { z } from "zod";

import { labelSchema } from "@/validators/post";

import { parseTweetId } from "@/lib/x";

const tweetLink = z
    .string()
    .trim()
    .refine((url) => parseTweetId(url) !== null, "Not an X post link");

export const addPostFormSchema = z.object({
    link: tweetLink,
    label: labelSchema,
    reason: z.string().trim().min(1, "Add a reason"),
    proof: z
        .string()
        .transform((value) => value.split(/\s+/).filter(Boolean))
        .pipe(z.array(tweetLink)),
    noSource: z.boolean(),
    noMedia: z.boolean(),
});

export type AddPostForm = z.infer<typeof addPostFormSchema>;
