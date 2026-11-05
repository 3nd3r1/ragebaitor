import {
    date,
    index,
    jsonb,
    pgEnum,
    pgTable,
    primaryKey,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

import type { Content } from "@/validators/post";

export const label = pgEnum("label", ["bait", "genuine"]);

export const posts = pgTable(
    "posts",
    {
        id: text().primaryKey(),
        label: label().notNull(),
        content: jsonb().$type<Content>().notNull(),
        reason: text().notNull(),
        sourceUrl: text(),
        proof: jsonb().$type<Content[]>(),
        date: date(),
        createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    },
    (table) => [index().on(table.date)]
);

export const votes = pgTable(
    "votes",
    {
        postId: text()
            .notNull()
            .references(() => posts.id, { onDelete: "cascade" }),
        playerId: uuid().notNull(),
        guess: label().notNull(),
        createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    },
    (table) => [primaryKey({ columns: [table.postId, table.playerId] })]
);
