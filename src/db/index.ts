import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { getServerEnv } from "@/lib/env";

import * as schema from "@/db/schema";

const createDb = () =>
    drizzle({
        client: postgres(getServerEnv().DATABASE_URL),
        schema,
        casing: "snake_case",
    });

// Dev hot reloads re-run this module, so reuse one pool instead of leaking one per reload.
const globalForDb = globalThis as { db?: ReturnType<typeof createDb> };

export const getDb = () => (globalForDb.db ??= createDb());
