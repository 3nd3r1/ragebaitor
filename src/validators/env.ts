import { z } from "zod";

export const serverEnvSchema = z.object({
    DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
    MEDIA_DIR: z.string().min(1).default("media"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
