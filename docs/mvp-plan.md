# Plan

Phase 1 is done: the game is playable with no backend. Phase 2 moves posts and votes to Postgres and adds an admin page.

## How Phase 1 works

Posts are in `src/data/posts.json`, validated by `src/validators/post.ts`. `npm run add-post` adds them ([capture.md](./capture.md)). Everything ships in the client bundle, so answers can be read from it until Phase 2.

Daily set, in `src/lib/daily.ts`:

- The day changes at the player's local midnight. The day number counts from a fixed launch date and shows in the share text.
- Each day takes the next 5 bait and next 5 genuine posts in id order, then cycles when the pool runs out. New posts get higher ids, so adding them doesn't change upcoming days.
- The 10 are shuffled with a seed from the date, so everyone gets the same order.

Game state is in localStorage, in `src/hooks/use-daily-game.ts`. A reload resumes mid-round. Editing `posts.json` mid-day doesn't move guesses onto other posts. The streak counts consecutive days with a finished round.

## Phase 2: Postgres

Postgres runs as a Coolify database, with backups from Coolify. The app reaches it from server code through Drizzle, using `DATABASE_URL`. Locally it runs from `docker-compose.yml`. Self-hosted Supabase was skipped because it's about a dozen services for three tables and one login, and hosted Supabase pauses free projects after a week without activity.

Data:

- `posts` holds what `posts.json` has now, plus an optional `date`. A dated post only appears on that date and never joins the cycle, so pinning one doesn't shift other days. Dated posts fill their day first and the cycle fills the rest.
- `votes` holds post, anonymous player id and guess, with one vote per player per post.
- Images move from `public/posts` to a Coolify persistent volume, served by a route. A Next.js build only serves `public/` files that existed at build time, so uploads from the admin page wouldn't show otherwise.

API:

- The client sends its local date, and the server accepts today plus or minus a day. It returns that day's posts without labels, so answers can't be read from the bundle.
- Posting a guess stores the vote and returns the label, reason and crowd split.

Admin at `/admin`, behind one password from `ADMIN_PASSWORD`. It shows the next 7 days, pins posts to dates and adds posts from an X link like `add-post` does. Changes go live without a redeploy.

## Decisions

| Question           | Decision                                                                          |
| ------------------ | --------------------------------------------------------------------------------- |
| Share text         | Score, grid and link. 🎣 = got baited, ⬜ = called it right                       |
| Buttons            | Bait and Genuine only. Maybe "can't tell" later                                   |
| Engagement numbers | Hidden. Revisit after playtesting                                                 |
| Post format        | Fetched from an X link and drawn as our own card. Screenshots for other platforms |
| Proof              | Optional. `reason` is always required                                             |
| Video              | Later                                                                             |
| Finnish set        | Out of scope for now                                                              |
| Look               | Dark only. Phone: post, then buttons. Laptop: post left, actions right            |
