import { describe, expect, it } from "vitest";

import { serverEnvSchema } from "@/validators/env";

describe("serverEnvSchema", () => {
    it("accepts a postgres url and defaults MEDIA_DIR", () => {
        expect(
            serverEnvSchema.parse({
                DATABASE_URL: "postgres://u:p@localhost/db",
            })
        ).toEqual({
            DATABASE_URL: "postgres://u:p@localhost/db",
            MEDIA_DIR: "media",
        });
    });

    it("rejects a missing or non-postgres url", () => {
        expect(() => serverEnvSchema.parse({})).toThrow();
        expect(() =>
            serverEnvSchema.parse({ DATABASE_URL: "mysql://localhost/db" })
        ).toThrow();
    });
});
