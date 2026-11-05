import { type ServerEnv, serverEnvSchema } from "@/validators/env";

let cached: ServerEnv | undefined;

export const getServerEnv = (): ServerEnv => {
    cached ??= serverEnvSchema.parse(process.env);
    return cached;
};
