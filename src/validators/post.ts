import { z } from "zod";

export const labelSchema = z.enum(["bait", "genuine"]);

export const mediaSchema = z.object({
    type: z.literal("image"),
    url: z.string().startsWith("/posts/"),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    alt: z.string().optional(),
});

export const contentSchema = z
    .object({
        handle: z
            .string()
            .regex(/^@\w+$/)
            .optional(),
        text: z.string().optional(),
        media: z.array(mediaSchema),
    })
    .refine((content) => content.text || content.media.length > 0, {
        message: "Content needs text or media",
    });

export const postSchema = z.object({
    id: z.string().regex(/^p\d{3,}$/),
    label: labelSchema,
    content: contentSchema,
    reason: z.string().min(1),
    sourceUrl: z.url().optional(),
    proof: z.array(contentSchema).optional(),
});

export const postsSchema = z
    .array(postSchema)
    .refine(
        (posts) => new Set(posts.map((post) => post.id)).size === posts.length,
        { message: "Post ids must be unique" }
    );

export type Label = z.infer<typeof labelSchema>;
export type Media = z.infer<typeof mediaSchema>;
export type Content = z.infer<typeof contentSchema>;
export type Post = z.infer<typeof postSchema>;
