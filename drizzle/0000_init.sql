CREATE TYPE "public"."label" AS ENUM('bait', 'genuine');--> statement-breakpoint
CREATE TABLE "posts" (
	"id" text PRIMARY KEY NOT NULL,
	"label" "label" NOT NULL,
	"content" jsonb NOT NULL,
	"reason" text NOT NULL,
	"source_url" text,
	"proof" jsonb,
	"date" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "votes" (
	"post_id" text NOT NULL,
	"player_id" uuid NOT NULL,
	"guess" "label" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "votes_post_id_player_id_pk" PRIMARY KEY("post_id","player_id")
);
--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "posts_date_index" ON "posts" USING btree ("date");