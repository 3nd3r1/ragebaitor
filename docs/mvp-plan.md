# Plan

Phase 1 is done: the game is playable with no backend. Phase 2 moves posts and votes to Supabase.

## How Phase 1 works

Posts are in `src/data/posts.json`, validated by `src/validators/post.ts`. `npm run add-post` adds them ([capture.md](./capture.md)). Everything ships in the client bundle, so answers can be read from it until Phase 2.

Daily set, in `src/lib/daily.ts`:

- The day changes at the player's local midnight. The day number counts from a fixed launch date and shows in the share text.
- Each day takes the next 5 bait and next 5 genuine posts in id order, then cycles when the pool runs out. New posts get higher ids, so adding them doesn't change upcoming days.
- The 10 are shuffled with a seed from the date, so everyone gets the same order.

Game state is in localStorage, in `src/hooks/use-daily-game.ts`. A reload resumes mid-round. Editing `posts.json` mid-day doesn't move guesses onto other posts. The streak counts consecutive days with a finished round.

## Phase 2: Supabase

- Tables `posts`, `daily_sets` and `votes`, seeded from `posts.json` by a script
- `GET /api/daily` returns today's posts without labels. Posting a guess returns the label, reason and crowd split
- Anonymous `playerId` in localStorage, one vote per player per post
- Crowd % cached for a few minutes
- Flag posts where the crowd disagrees with the label by a wide margin

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
